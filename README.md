# Timeless Knight
js13k Game  
David Torres 2019
v. 0.1

## Game Mission
My goal for Timeless Knight is to recreate a classic "clicker" game with RPG and Idle elements in under 13kb of JavaScript.

The player controls a knight who is seeking the power of the "Timeless Blade" which has the power to bring you back in time.  He is confronted on his journey with monsters every step of the way until he finally defeats the blade holder.  Upon receiving the blade he is instantly transported back to the start of his journey, never realizing that he has already obtained the blade and is on a constant loop.

## Game Mechanics
The knight faces 100 waves of enemies.  Each wave consists of 9 minions and 1 elite level monster.  The final 100th wave includes 9 elite monsters and 1 boss level monster.

Each monster killed grants the knight gold, he can use the gold to upgrade certain gear pieces or to hire party members.  Monsters drop a set amount of gold that scales up for each wave.  Elite monsters drop 5x the gold of that wave.  Boss monsters drop the "Timeless Blade" which resets the game.  Each Timeless Blade the player obtains improves his abilities by a certain percentage, and also increases the power of monsters.  Beating the wave 100 boss is considered "beating" the game, but it is actually endless as each "reset" is similar to a New Game+.

Due to the nature of the game, player health & damage plus monster health, damage, and gold gain will probably change during development to balance the power of the player and give him a challenge no matter what wave or loop he is on.

## Timeless Knight (Player)
The player controls a nameless knight who wakes up confused, all they can remember is a burning desire to obtain the Timeless Blade.  Through the journey, the player can tap/click the screen to attack monsters, as well as upgrade their knight.
- HP Bar, when HP hits 0, the wave is reset *(forshadowing that the player already has the Timeless Blade)*
- Damage Per Swing, set at a certain amount, only improved by Gear upgrading
- Bag of Gold, starts at 0, gain gold per monster, up to a certain amount.  Improve gold gain rate & limit by upgrading gear

## Gear
Gear slots are limited to:
- Weapon (Upgrade to increase player damage per swing)
- Armor (Upgrade to increase player max health)
- Gold Bag (Upgrade to increase player gold gain & max gold)

## Timeless Blade
Obtaining the Timeless Blade resets your game and allows you to choose a bonus to restart with.
- Extra Gold per Monster
- Extra Player & Party Damage
- Less Monsters per Wave
- Less Monster Damage
- Cheaper Upgrade Costs for Player and Party

## Party Members
Obtaining gold allows you to recruit up to 3 party members.  Party members have unique characteristics and will help the player knight on their journey.
- Priest: Heals the knight by a set amount per second, does no damage to monsters.  Upgrading the priest improves the HP/sec buff.
- Rogue: Steals extra gold from each monster, does minor damage to monsters.  Upgrading the rogue, improves the gold/monster & DPS buff.
- Mage: Casts spells at monsters for a high damage per second.  Upgrading the mage improves the DPS/sec buff.

## Monsters
Monsters in this game are tough!  The Timeless Knight will never reach wave 100 without upgrading or with the help of party members, as the monsters are more powerful in each wave.  Monsters come in a small variety:
- Minions: Does constant DPS to the Knight, relatively easy to kill, provides a small amount of gold on death
- Elites: Does high DPS to the Knight, difficult to kill, provides a large amount of gold on death.
- Boss: Timeless Blade wielder, does extra damage to the Knight, extremely difficult to kill, provides Timeless Blade buff and reset

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
- Create base data for wave & loop progression
- Create trigger for spawning waves & spawning each enemy in wave
- Create enemy attack interval upon spawning
- Allow user input "attack" by clicking anywhere in battle area
- Trigger gold increase when monster dies based on monster type
- Trigger wave reset upon player death
- Implement upgrade functionality of Gear
- Implement party member purchase capability
- Implement party member attack/heal interval upon purchase
- Add party member upgrade capability
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
- Button: Upgrade gear
- Button: Purchase Party Members
- Button: Upgrade Party Members