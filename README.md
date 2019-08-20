# Timeless Knight
js13k Game  
David Torres 2019
v. 0.2

## Game Mission
My goal for Timeless Knight is to recreate a classic "clicker" game with RPG and Idle elements in under 13kb of JavaScript.

The player controls a knight who is seeking the power of the "Timeless Blade" which has the power to bring you back in time.  He is confronted on his journey with monsters every step of the way until he finally defeats the blade holder.  Upon receiving the blade he is instantly transported back to the start of his journey, never realizing that he has already obtained the blade and is on a constant loop.

## Game Mechanics
The knight faces 50 waves of enemies.  Each wave consists of 9 minions and 1 elite level monster.  The final wave includes 9 elite monsters and 1 boss level monster.  If the knight should die, the wave is reset and all gold being held is lost.  Between waves lies a campfire, where the knight restores health and can increase their power.  This is also where you can save or load the game, and view stats.

Each monster killed grants the knight gold, gold is used to upgrade gear or to purchase and upgrade skills.  Monsters drop a set amount of gold that scales up for each wave.  Elite monsters drop 3x the gold of that wave.  Boss monsters drop the "Timeless Blade" which resets the game.  Each Timeless Blade the player obtains improves their abilities by a certain percentage, and also increases the power of monsters.  Beating the wave 50 boss is considered "beating" the game, but it is actually endless as each "reset" is similar to a New Game+.

## Timeless Knight (Player)
The player controls a nameless knight who wakes up confused, all they can remember is a burning desire to obtain the Timeless Blade.  Through the journey, the player can tap/click the screen to attack monsters, as well as upgrade their knight.
- HP Bar, when HP hits 0, the wave is reset *(forshadowing that the player already has the Timeless Blade)*
- Damage Per Swing, set at a certain amount, only improved by Gear upgrading
- Bag of Gold, starts at 0, gain gold per monster.

## Gear
Gear slots are limited to:
- Weapon (Upgrade to increase player damage per swing)
- Armor (Upgrade to increase player max health)

## Skills
Obtaining gold allows you to purchase up to 3 passive skills.  Passive skills have unique characteristics and will help the player knight on their journey.
- **Regen**: Regenerate health by a set amount per second.  Upgrade improves the HP/sec buff.
- **Midas**: Passively gain gold per second.  Upgrade improves the gold/sec buff.
- **Aura**: Pulsing aura damages enemies automatically.  Upgrade improves damage done.

## Monsters
Monsters in this game are tough!  The Timeless Knight will never reach wave 50 without upgrading gear and the help of skills, as the monsters are more powerful in each wave.  Monsters come in a small variety:
- Minions: Does constant DPS to the Knight, relatively easy to kill, provides a small amount of gold on death
- Elites: Does high DPS to the Knight, difficult to kill, provides a large amount of gold on death.
- Boss: Timeless Blade wielder, does extra damage to the Knight, extremely difficult to kill, provides Timeless Blade buff and reset

## Timeless Blade
Obtaining the Timeless Blade resets your game and allows you to choose a bonus to restart with.
- Extra Gold per Monster
- Extra Player Damage
- Less Monsters per Wave
- Less Elite Damage
- Cheaper Upgrade Costs

## Timeframe
The project has a deadline of September 13th, 2019.  This gives me 1 month to complete the project. I am dividing the project into two, two-week sprints.
1. **Sprint 1: JavaScript Logic**  
*(August 13th - August 26th)*  
2. **Sprint 2: Design, Aesthetics, Story**  
*(August 27th - September 10th)*  


## Logic
Implement game loop functionality, ignoring design completely.  
- ~~Create stores for player HP, Damage, Gold Capacity, Gold Stock, Wave, Loop, Stats (Total Damage Done, Total Gold Obtained, Monsters Killed, etc.)~~
- ~~Create base data for enemy HP, Damage, Gold Drops + Elite & Boss values~~
- ~~Create base data for party member DPS/HPS/GPS~~
- ~~Create base data for Timeless Blade rest buffs Damage, Health, Gold upgrades~~
- ~~Create base data for wave & loop progression~~
- ~~Create trigger for spawning waves & spawning each enemy in wave~~
- ~~Create enemy attack interval upon spawning~~
- ~~Allow user input "attack" by clicking anywhere in battle area~~
- ~~Trigger gold increase when monster dies based on monster type~~
- ~~Trigger wave reset upon player death~~
- ~~Implement upgrade functionality of Gear~~
- ~~Implement skill purchase capability~~
- ~~Implement skill attack/heal interval upon purchase~~
- Add skill upgrade capability
- Add Timeless Blade event & counter
- Add pause game functionality
- Add save game functionality
- Add in monetization and personal contact links

## Screen Display
The user interface should display the following:
- Animation: A background animation to simulate moving to the right
- Animation: A walking sprite of the Timeless Knight
- Animation: A swinging sprite of the Timeless Knight
- Animation: A slice animation on player click / tap
- Animation: Enemy sprite (minion, elite, boss)
- Animation: Party member sprites (Priest, Rogue, Mage)
- Display: Knight HP
- Display: Knight Damage per Swing
- Display: Knight Current/Max gold
- Display: Enemy HP
- Display: Current Wave Number
- Display: Monsters per Wave Progress
- Display: Timeless Loop number (after first blade)
- Button: Retreat to Campfire
- Button: Return to Battle
- Button: Face Next Wave
- Button: Purchase Skill
- Button: Upgrade Skill
- Button: Upgrade Gear