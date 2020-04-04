# OrbitalCrash

# Goals

- infinite horizontal world
- constantly scrolling forward
- server generated enemies, powerups, and events
- goal is to stay alive and generate the most points
  - leaderboards

# Todo

- [ ] warning when you go too far left?
- [ ] keep everyone mostly near each other
- [ ] add death effect
- [ ] make sure disconnect and kill work
- [ ] watch other shmups
- [ ] leaderboard
  - [ ] redis
- [ ] take damage
  - [ ] die
- [ ] make collision code better
- [ ] add powerups
  - [ ] two clones fight with you
- [ ] come up with more enemies
- [ ] come up with realtime events
  - [ ] big bosses every 5 min?
  - [ ] build big enemy like in top left of Kenney expansion
- [ ] add lambda for join/etc, checks redis for servers, spins one up?
- [ ] add login register
- [ ] add leaderboard
- [ ] support multiple bounding boxes
- [ ] improve bot logic
- [ ] figure out multiplayer jumpiness on move
- [ ] add collisionless entities
- [ ] abstract game events into a class
  - [ ] register event at tick?
  - [ ] puzzles solve together like a maze blow up walls game event
- [ ] add rock debris
- [ ] drop powerups from enemy
- [ ] drop powerups from debris
- [ ] drop bombs
- [ ] figure out collision position for explosion
- [ ] make keyboard wasd
- [ ] connect on login screen??
- [ ] see if entity.create is needed
- [ ] fix explosion animation
- [ ] add shields
  - [ ] you always have shield that regens but also upgradable
- [ ] test what happens if server crashes
- [ ] i think interpolateEntities can be cleaner simplier
- [ ] validate input sequence number so they can't send garbage negative, etc
- [ ] 3 lives before you die and reset???
- [ ] add audio
- [ ] hard to go straight left with nipplejs
- [ ] rename or remove lastProcessedInputSequenceNumber
- [ ] add 5 second sustained laser
- [ ] maybe remove momentum
- [ ] server is offline, play with bots
- [ ] show game in background of login, add spectator mode to server
- [ ] add analytics to server to see users connected, enemies, etc
- [ ] add shake screen effects when bomb
- [ ] watch ad to get upgrade, or micro-transaction or donate cup of coffee
  - [ ] how do other guys do it itch.io
- [ ] let streamers create their own server and send their own waves of enemies until everyone dies?????????
- [ ] for huge streamers 500 people play across 10 servers, same script tho
- [ ] add license to repo
- [x] validate buffer so client get send garbage, try catch and boot user
- [x] move byte buffer code into individual entity
- [x] refactor clientGame to be more dynamic and support adding entities easier
- [x] determine screen size
  - [x] scaling
  - [x] cant go off the screen
- [x] better kenney assets
- [x] shot explode effect
- [x] gun shooting offcenter when youre moving
- [x] add momentum to movement
- [x] alternate left right on shot
- [x] better mobile support
  - [x] add mouse movement
  - [x] add full screen rotate code
- [x] binary transfer
- [x] better background
- [x] refactor code
  - [x] better separation
  - [x] proper draw
  - [x] add better bounding box for collisions
- [x] clean up serialize, worldstate, buffer builder
- [x] make it easier to add things add entities and sync fields
- [x] add worldstate filtering
- [x] build bots
- [x] load test
- [x] deploy to beanstalk
- [x] determine how to scale up servers dynamically
