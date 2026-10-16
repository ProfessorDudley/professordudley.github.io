"""Minimal MCP stdio client (JSON-RPC, stdlib only).

Spawns an MCP server subprocess, runs the initialize handshake, and exposes
call_tool(name, arguments). One persistent subprocess per Engine instance.
"""
import json
import queue
import subprocess
import threading


class Engine:
    def __init__(self, cmd, cwd, env):
        self.proc = subprocess.Popen(
            cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL, cwd=cwd, env=env, text=True, bufsize=1)
        self._qid = 0
        self._pending = {}
        self._lock = threading.Lock()
        reader = threading.Thread(target=self._read_loop, daemon=True)
        reader.start()
        self._request("initialize", {
            "protocolVersion": "2024-11-05", "capabilities": {},
            "clientInfo": {"name": "sprite-studio", "version": "0.1"},
        })
        self._notify("notifications/initialized", {})

    def _send(self, msg):
        self.proc.stdin.write(json.dumps(msg) + "\n")
        self.proc.stdin.flush()

    def _request(self, method, params):
        if self.proc.poll() is not None:
            raise RuntimeError("mcp server process exited")
        with self._lock:
            self._qid += 1
            qid = self._qid
        box = queue.Queue()
        self._pending[qid] = box
        self._send({"jsonrpc": "2.0", "id": qid, "method": method, "params": params})
        try:
            msg = box.get(timeout=300)
        except queue.Empty:
            raise RuntimeError("mcp server did not respond (is it still running?)")
        if "error" in msg:
            raise RuntimeError(msg["error"].get("message", msg["error"]))
        return msg.get("result", {})

    def _notify(self, method, params):
        self._send({"jsonrpc": "2.0", "method": method, "params": params})

    def _read_loop(self):
        for line in self.proc.stdout:
            line = line.strip()
            if not line.startswith("{"):
                continue
            try:
                msg = json.loads(line)
            except ValueError:
                continue
            if "id" in msg and msg["id"] in self._pending:
                self._pending.pop(msg["id"]).put(msg)

    def call(self, tool, arguments):
        """Call a tool; returns concatenated text content."""
        res = self._request("tools/call", {"name": tool, "arguments": arguments})
        parts = []
        for item in res.get("content", []):
            if item.get("type") == "text":
                parts.append(item.get("text", ""))
        return "\n".join(parts)

    def close(self):
        try:
            self.proc.terminate()
        except OSError:
            pass
