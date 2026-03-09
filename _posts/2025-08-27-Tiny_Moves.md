---
layout: default
title: Tiny Moves
summary: A game jam submission made in 48 hours about walking along a tightrope.
---
## Tiny Moves
Tiny moves is a game I have made in Godot Engine as part of a game jam my friends organised. The game was developed over two days from Friday afternoon till Sunday afternoon. Afterwards we all tried each others games and gave feedback.
I have ideas to possibly develop this game further into a mobile game. I have done some brief testing and have got it running on phones. Maybe in the future I will take this further.
The game is available on Itch.Io.

### Development
The theme for the game jam was "Tiny". I did some brainstorming and had some ideas around what tiny means. It could mean low resolution, or small file size. Maybe the characters are tiny (in fact my brother took it to mean this and developed a game with ants). I settled on the idea of balance beam and needing to make small adjustments to prevent falling.

I wanted the game to feel fluid; as if the character was unbalanced. To achieve this I used a physics based player controller. Literally, I used a collision sphere and applied torque to causer the ball to rotate. I set this to be invisible and placed a static character model inside. I had in essence invented a hamster ball. Out of the box it didn't feel quite right; it took some adjustments to the weight and torque to feel tight. It showed promise so I left it as "good enough" and moved on to level design.

Not my strongest area but I feel like I did reasonably well for the scope of the game. I downloaded an asset pack by Kenny which provided grassy fields, fences and foliage. From this I built out a small starting section. I made this area somewhat spacious so players could get a hand of the controls before starting their tightrope challenge. For the tightrope, I used the side of a ladder asset. From the perspective of the camera, you would never know. It did well to act as a thin line for the player to move across. I wrote a script that detected when the player was near the end of the tightrope and would spawn a new one in front of them. This allowed the game to be effectively endless. 

At this point, the game was trivially easy - just press 'W' from the start of the game. To add difficulty I had two options. Either make the tightrope shape more complex, or apply sideways force the the player. I settled on the latter because I felt it was more in theme of balancing and it would be quicker for me to apply forces to the player than to design more tightrope pieces. With this decision I also needed to refine the movement controls to make them feel tight.

The game was now pretty much in place and I had time to polish. This meant adding a main menu / title screen, adding a score readout, music and graphics. For the main menu, I again used assets from Kenny and add constructed a straightforward menu with play, controls and quit buttons. Play and quit work as expected. The controls button showed a diagram of available button inputs. Upon starting the game the music would play. Typically, I would ask @DragonKiwi if he wanted to the music for the game. However he was also participating in this jam so I looked online for music. I wanted something that was melodic to match the setting, yet chaotic to match the uneasy feeling of balancing high up on a tightrope. For graphics I wanted to have a go at using shaders. I found a shader which caused the game to render at a lower resolution so it looked like pixel graphics even though it was a 3D scene. The final step was to add some UI to the game itself. A simple score readout - which is just a measurement of how far forward the player has moved, and a pause screen. 