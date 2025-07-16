// --- CLUE DATA ---
const cluesJSON = [
    { "title": "Finding Nemo", "clue": "Helicopter parent commits multiple felonies trying to retrieve his runaway son with a lucky blue amnesiac.", "category": "Family", "emoji": "🐠" },
    { "title": "Frozen", "clue": "Woman ruins summer because no one taught her emotional regulation.", "category": "Family", "emoji": "🐠" },
    { "title": "Toy Story", "clue": "A man's entire identity is threatened by a shiny new replacement.", "category": "Family", "emoji": "🐠" },
    { "title": "The Lion King", "clue": "Exiled prince returns with a meerkat and a warthog sidekick to reclaim his crown.", "category": "Family", "emoji": "🐠" },
    { "title": "Moana", "clue": "Unsanctioned teen sea voyage leads to property damage and magical theft.", "category": "Family", "emoji": "🐠" },
    { "title": "Shrek", "clue": "Green man destroys social norms after being forced into arranged marriage rescue mission.", "category": "Family", "emoji": "🐠" },
    { "title": "The Incredibles", "clue": "An insurance adjuster, bored with his life, secretly moonlights in his old job and causes millions in property damage, forcing his family to clean up the mess.", "category": "Family", "emoji": "🐠" },
    { "title": "Up", "clue": "Elderly man uses balloons to escape grief and accidentally adopts a boy scout.", "category": "Family", "emoji": "🐠" },
    { "title": "WALL-E", "clue": "Robot janitor stalks coworker across the galaxy while accidentally saving humanity.", "category": "Family", "emoji": "🐠" },
    { "title": "Inside Out", "clue": "Girl's brain committee mismanages her parents' divorce with catastrophic results.", "category": "Family", "emoji": "🐠" },
    { "title": "Coco", "clue": "Boy illegally enters afterlife to pursue music career against family wishes.", "category": "Family", "emoji": "🐠" },
    { "title": "Zootopia", "clue": "A small-town bunny moves to the big city and uncovers a vast conspiracy involving predatory behavior and a surprisingly slow government agency.", "category": "Family", "emoji": "🐠" },
    { "title": "Big Hero 6", "clue": "Teen builds illegal fighting robot to avenge his brother's death.", "category": "Family", "emoji": "🐠" },
    { "title": "Monsters, Inc.", "clue": "Energy company discovers child labor violations lead to better business model.", "category": "Family", "emoji": "🐠" },
    { "title": "Finding Dory", "clue": "Fish with short-term memory loss leads friends on cross-ocean road trip.", "category": "Family", "emoji": "🐠" },
    { "title": "The Good Dinosaur", "clue": "A clumsy, prehistoric farming accident leads to a boy domesticating his very first pet human.", "category": "Family", "emoji": "🐠" },
    { "title": "Ratatouille", "clue": "Rat manipulates human to achieve his culinary dreams in Parisian restaurant.", "category": "Family", "emoji": "🐠" },
    { "title": "Cars", "clue": "Talking car learns humility through community service in backwater town.", "category": "Family", "emoji": "🐠" },
    { "title": "A Bug's Life", "clue": "Ant lies about having friends and accidentally starts a revolution.", "category": "Family", "emoji": "🐠" },
    { "title": "Brave", "clue": "A rebellious teenager's poor choice in desserts leads to a major communication breakdown with her mother, who becomes unbearable.", "category": "Family", "emoji": "🐠" },
    { "title": "The Princess and the Frog", "clue": "Waitress kisses frog and gets stuck in amphibian form until she learns about dreams.", "category": "Family", "emoji": "🐠" },
    { "title": "Tangled", "clue": "Kidnapped girl with magical hair falls for her first stalker.", "category": "Family", "emoji": "🐠" },
    { "title": "Wreck-It Ralph", "clue": "Video game villain has existential crisis and destroys multiple gaming worlds.", "category": "Family", "emoji": "🐠" },
    { "title": "Despicable Me", "clue": "A grumpy man's plan to steal the moon is derailed by an unexpected and poorly supervised adoption.", "category": "Family", "emoji": "🐠" },
    { "title": "How to Train Your Dragon", "clue": "Viking teen befriends natural enemy and revolutionizes his culture's military strategy.", "category": "Family", "emoji": "🐠" },
    { "title": "Paddington 2", "clue": "An immigrant bear is framed for a crime he didn't commit, but his good manners win over the prison population.", "category": "Family", "emoji": "🐠" },
    { "title": "The Mitchells vs. the Machines", "clue": "A dysfunctional family's road trip is interrupted by a robot apocalypse, and they're the only ones who can stop it.", "category": "Family", "emoji": "🐠" },
    { "title": "Klaus", "clue": "A lazy postman is sent to a remote, feuding town and accidentally invents Santa Claus.", "category": "Family", "emoji": "🐠" },
    { "title": "The Emperor's New Groove", "clue": "A selfish ruler is turned into a llama and must rely on a peasant to regain his throne.", "category": "Family", "emoji": "🐠" },
    { "title": "Lilo & Stitch", "clue": "A lonely Hawaiian girl adopts a destructive alien experiment as her 'dog'.", "category": "Family", "emoji": "🐠" },
    { "title": "Mulan", "clue": "A young woman impersonates a man to take her father's place in the army.", "category": "Family", "emoji": "🐠" },
    { "title": "The Iron Giant", "clue": "A young boy befriends a giant alien robot during the Cold War.", "category": "Family", "emoji": "🐠" },
    { "title": "Spirited Away", "clue": "A girl gets trapped in a world of spirits and must work in a bathhouse to save her parents.", "category": "Family", "emoji": "🐠" },
    { "title": "My Neighbor Totoro", "clue": "Two sisters move to the countryside and befriend magical forest spirits.", "category": "Family", "emoji": "🐠" },
    { "title": "The LEGO Movie", "clue": "An ordinary construction worker is mistaken for a prophesied hero and must save the world from being glued together.", "category": "Family", "emoji": "🐠" },
    { "title": "Star Wars", "clue": "Farm boy discovers his father is a space fascist with breathing problems.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Matrix", "clue": "Programmer discovers reality is fake and learns kung fu via download.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Blade Runner", "clue": "Future cop hunts artificial humans who just want more time to live.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Back to the Future", "clue": "Teen accidentally prevents his parents' meet-cute and nearly erases himself.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Alien", "clue": "A long-haul space crew answers a distress call and ends up with a very aggressive, uninvited passenger with a dental problem.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "E.T.", "clue": "Alien botanist gets stranded and relies on children to phone home.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Terminator", "clue": "Robot assassin travels back in time but develops parenting instincts.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "2001: A Space Odyssey", "clue": "Computer develops trust issues and locks humans out of spaceship.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Close Encounters of the Third Kind", "clue": "Man becomes obsessed with mashed potato sculptures after alien encounter.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Thing", "clue": "Antarctic researchers play deadly game of \"Who's the Shapeshifter?\"", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Star Trek", "clue": "Space explorers diplomatically solve problems while wearing colorful shirts.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Independence Day", "clue": "Global property values plummet after uninvited tourists in big ships show up for a very hostile holiday weekend.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Men in Black", "clue": "Secret agents police alien immigrants while wearing stylish sunglasses.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Jurassic Park", "clue": "Scientists clone dinosaurs and immediately lose control of the situation.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Fifth Element", "clue": "Taxi driver must save universe with perfect woman and colorful stones.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Total Recall", "clue": "Man's vacation memories turn out to be implanted spy thriller.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Minority Report", "clue": "Future cop arrests people for crimes they haven't committed yet.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "I, Robot", "clue": "Detective investigates robot crime while robots insist they're following protocol.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "War of the Worlds", "clue": "Martians invade Earth but forget to bring cold medicine.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "District 9", "clue": "Alien refugees live in slums while humans debate immigration policy.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Avatar", "clue": "Disabled marine goes native on alien planet and fights his former employers.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Interstellar", "clue": "Farmer travels through wormhole to save humanity while his daughter ages.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Gravity", "clue": "Astronaut has worst day at work imaginable while orbiting Earth.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Martian", "clue": "Botanist grows potatoes on Mars while NASA figures out rescue mission.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Ex Machina", "clue": "Programmer falls in love with AI during extended Turing test.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Arrival", "clue": "Linguist learns alien language and discovers time is non-linear.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Ready Player One", "clue": "Teen searches virtual reality for easter eggs to inherit video game fortune.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "A Quiet Place", "clue": "Family lives in silence to avoid sound-hunting alien predators.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Inception", "clue": "Thief enters dreams within dreams to plant ideas instead of stealing them.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Prestige", "clue": "Rival magicians use science to create increasingly dangerous illusions.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Dune", "clue": "A young nobleman's family is betrayed, forcing him to ally with desert nomads and giant worms.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Edge of Tomorrow", "clue": "A soldier in a war against aliens gets stuck in a time loop, dying and reliving the same day over and over.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Her", "clue": "A lonely man falls in love with his advanced operating system.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Children of Men", "clue": "In a future where humanity is infertile, a cynical bureaucrat must protect the world's only pregnant woman.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Gattaca", "clue": "In a eugenics-driven society, a genetically 'inferior' man assumes a superior identity to pursue his lifelong dream of space travel.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Source Code", "clue": "A soldier is sent into a dead man's last 8 minutes of life to find a bomber.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Looper", "clue": "A mob hitman who kills victims sent back in time from the future is confronted by his older self.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "The Truman Show", "clue": "A man's entire life has been a non-stop reality TV show, and he's the only one who doesn't know.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Eternal Sunshine of the Spotless Mind", "clue": "A couple undergoes a medical procedure to have each other erased from their memories.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Primer", "clue": "Two engineers accidentally invent a time machine in their garage and immediately cause paradoxes.", "category": "Sci-Fi", "emoji": "🤖" },
    { "title": "Iron Man", "clue": "Billionaire builds metal suit in cave and becomes world's most expensive superhero.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Spider-Man", "clue": "Teen gains spider powers and immediately uses them to impress classmates.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Batman", "clue": "Rich orphan dresses as bat to punch crime instead of funding social programs.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Superman", "clue": "Alien refugee hides identity behind glasses while working at newspaper.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Wonder Woman", "clue": "Amazon princess leaves island paradise to stop world war with love.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Avengers", "clue": "Dysfunctional team of heroes argues until an alien invasion forces cooperation.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Captain America", "clue": "Skinny guy takes steroids and punches Nazis for democracy.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Thor", "clue": "Norse god learns humility through exile to New Mexico desert.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Hulk", "clue": "Scientist's anger management issues cause property damage on massive scale.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Black Panther", "clue": "A new king must decide whether to continue his country's isolationist policies or risk their most valuable resource being stolen.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Guardians of the Galaxy", "clue": "Space criminals accidentally become heroes while trying to sell stolen orb.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Doctor Strange", "clue": "Arrogant surgeon discovers magic and saves reality through time loop.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Ant-Man", "clue": "Thief shrinks to insect size and infiltrates his mentor's former company.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Captain Marvel", "clue": "Air Force pilot discovers she's actually alien weapon with memory problems.", "category": "Superhero", "emoji": "🦸" },
    { "title": "X-Men", "clue": "Mutant teenagers attend private school while society debates their civil rights.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Deadpool", "clue": "A terminally ill man undergoes an experimental treatment that successfully cures him but ruins his social media selfies forever.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Dark Knight", "clue": "A man in a bat costume has a prolonged, violent philosophical debate with a makeup enthusiast who just wants to watch the world burn.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Man of Steel", "clue": "Alien child grows up on farm and struggles with his destructive potential.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Justice League", "clue": "Team of heroes assembles to fight ancient threat while learning teamwork.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Aquaman", "clue": "Half-human prince must unite surface and ocean to prevent war.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Shazam", "clue": "Foster kid gains adult superhero body by saying magic word.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Flash", "clue": "Fastest man alive runs so fast he breaks time and creates alternate timelines.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Green Lantern", "clue": "Pilot gets alien ring that turns willpower into green energy constructs.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Watchmen", "clue": "Retired superheroes investigate conspiracy while world edges toward nuclear war.", "category": "Superhero", "emoji": "🦸" },
    { "title": "V for Vendetta", "clue": "Masked vigilante uses terrorist tactics to overthrow fascist government.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Suicide Squad", "clue": "A team of expendable supervillains is sent on a deadly mission to a remote island.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Joker", "clue": "A mentally ill party clown and aspiring comedian descends into madness and becomes a cultural icon.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Logan", "clue": "An aging, weary mutant must protect a young girl with similar powers on a cross-country road trip.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Spider-Man: Into the Spider-Verse", "clue": "A Brooklyn teen gets bitten by a radioactive spider and meets alternate versions of himself from other dimensions.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Birds of Prey", "clue": "A newly single supervillainess teams up with other female vigilantes to protect a young girl from a crime lord.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Batman", "clue": "A young, emo vigilante in his second year of fighting crime uncovers corruption while hunting a serial killer.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Eternals", "clue": "A team of immortal aliens who have secretly lived on Earth for thousands of years must reunite to protect humanity.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Shang-Chi and the Legend of the Ten Rings", "clue": "A San Francisco valet is forced to confront his past when his estranged father, a centuries-old warlord, re-emerges.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Black Widow", "clue": "A former spy is forced to confront her past and a conspiracy tied to her old 'family'.", "category": "Superhero", "emoji": "🦸" },
    { "title": "The Incredible Hulk", "clue": "A scientist on the run from the military must find a cure for the condition that turns him into a giant green monster when he's angry.", "category": "Superhero", "emoji": "🦸" },
    { "title": "Lord of the Rings", "clue": "A group of nine friends embarks on a cross-country journey to return some jewelry to its place of manufacture.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Harry Potter", "clue": "An orphan discovers he's a wizard and that his new boarding school has a shockingly high student mortality rate.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Princess Bride", "clue": "Farm boy becomes pirate to rescue true love from unwanted marriage.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Chronicles of Narnia", "clue": "Children discover magical world through wardrobe and get involved in lion politics.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Pan's Labyrinth", "clue": "Girl escapes Spanish Civil War trauma through dangerous fairy tale quests.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Dark Crystal", "clue": "Puppet elf must repair magical crystal to restore balance to alien world.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Labyrinth", "clue": "Teen navigates magical maze to rescue baby brother from David Bowie.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The NeverEnding Story", "clue": "Boy reads book where fantasy world needs child reader to prevent destruction.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Willow", "clue": "Farmer protects prophesied baby from evil queen with help of roguish swordsman.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Shape of Water", "clue": "Mute janitor falls in love with fish man held captive by government.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Pirates of the Caribbean", "clue": "Blacksmith teams up with pirate to rescue governor's daughter from undead crew.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Hobbit", "clue": "Homebody joins dwarf road trip to reclaim mountain from fire-breathing squatter.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Coraline", "clue": "Girl finds alternate reality where her parents have buttons for eyes.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Golden Compass", "clue": "Girl travels between parallel worlds with armored bear to save kidnapped children.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Stardust", "clue": "Young man crosses magical wall to find fallen star for his beloved.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Secret Garden", "clue": "Orphan girl discovers hidden garden that heals trauma through gardening therapy.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Big Fish", "clue": "Son tries to separate fact from fiction in his dying father's tall tales.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Edward Scissorhands", "clue": "Artificial man with scissors for hands struggles to fit into suburban society.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Beetlejuice", "clue": "Dead couple hires ghost to scare living family out of their house.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Nightmare Before Christmas", "clue": "Skeleton king discovers Christmas and tries to take over the holiday.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Alice in Wonderland", "clue": "Girl falls down rabbit hole into world of nonsensical characters and logic.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Wizard of Oz", "clue": "Girl transported to magical land must follow yellow road to return home.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Beauty and the Beast", "clue": "Woman develops Stockholm syndrome and falls in love with her captor.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Little Mermaid", "clue": "Mermaid gives up her voice to grow legs and pursue landlubber romance.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Aladdin", "clue": "Street thief uses genie wishes to impersonate prince and win princess.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Green Knight", "clue": "A young knight accepts a challenge from a mysterious tree-like being, and must face him again a year later.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Crouching Tiger, Hidden Dragon", "clue": "A stolen sword leads to a series of epic, high-flying martial arts battles.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "O Brother, Where Art Thou?", "clue": "Three escaped convicts in 1930s Mississippi embark on a journey to find a hidden treasure.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Fall", "clue": "A hospitalized stuntman tells a fantastical story to a little girl, with the lines between reality and fiction blurring.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The City of Lost Children", "clue": "A scientist in a surreal, steampunk world kidnaps children to steal their dreams.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Adventures of Baron Munchausen", "clue": "An elderly nobleman recounts his unbelievable adventures, which may or may not be true.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Time Bandits", "clue": "A young boy joins a group of time-traveling dwarves who are stealing treasure from various historical figures.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Seventh Seal", "clue": "A knight returning from the Crusades plays a game of chess with Death.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Being John Malkovich", "clue": "A puppeteer discovers a portal into the mind of the titular actor.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "The Fountain", "clue": "A man travels through time on a quest to save the woman he loves.", "category": "Fantasy", "emoji": "🧙" },
    { "title": "Titanic", "clue": "Rich girl and poor artist fall in love on sinking ship with insufficient lifeboats.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Notebook", "clue": "Man reads love story to wife with dementia who doesn't remember him.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "A Walk to Remember", "clue": "Bad boy falls for preacher's daughter who's secretly dying of leukemia.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Fault in Our Stars", "clue": "Teen cancer patients fall in love and travel to Amsterdam for closure.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Marley & Me", "clue": "Couple gets world's worst-behaved dog, then the dog dies of old age.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Old Yeller", "clue": "Boy's beloved dog gets rabies and family makes difficult end-of-life decision.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Bambi", "clue": "Deer child loses mother to hunters and grows up in forest trauma.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Lion King", "clue": "Cub watches father die in stampede orchestrated by jealous uncle.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "My Girl", "clue": "Tomboy's best friend dies from bee allergy during childhood adventure.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Ghost", "clue": "Dead man communicates through psychic to help girlfriend solve his murder.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "P.S. I Love You", "clue": "Widow receives posthumous letters from husband guiding her through grief.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Time Traveler's Wife", "clue": "Woman married to man who uncontrollably jumps through time.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Dear John", "clue": "Soldier and college student maintain long-distance relationship through letters.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Last Song", "clue": "Estranged daughter reconnects with dying father through music during final summer.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Me Before You", "clue": "Caregiver falls for quadriplegic man who plans to end his life legally.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Best of Me", "clue": "High school sweethearts reunite at friend's funeral and rekindle romance.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Safe Haven", "clue": "Abused woman starts new life in small town but past catches up.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "If I Stay", "clue": "Teen in coma after car crash must decide whether to live or die.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "One Day", "clue": "Friends meet annually on same date as their relationship evolves over decades.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Vow", "clue": "Husband tries to win back wife who lost memory of their marriage.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Hachi: A Dog's Tale", "clue": "Dog waits at train station every day for owner who died at work.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Terms of Endearment", "clue": "Mother and daughter's complicated relationship tested by terminal cancer diagnosis.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Steel Magnolias", "clue": "Southern women support each other through diabetes complications and loss.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Beaches", "clue": "Childhood friends maintain lifelong bond despite different paths and terminal illness.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Green Mile", "clue": "Death row guard discovers gentle giant prisoner has miraculous healing powers.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Brokeback Mountain", "clue": "Two cowboys in the 1960s American West develop a secret, decades-long romance.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Million Dollar Baby", "clue": "A determined female boxer convinces a hardened trainer to take her on, leading to a tragic end.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Boy in the Striped Pyjamas", "clue": "The son of a Nazi commandant befriends a Jewish boy in a concentration camp.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Schindler's List", "clue": "A German businessman saves over a thousand Jews during the Holocaust by employing them in his factories.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Requiem for a Dream", "clue": "The drug-induced utopias of four interconnected people are shattered when their addictions run deep.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Manchester by the Sea", "clue": "A janitor is forced to return to his hometown to care for his nephew after his brother's death, confronting a past tragedy.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Atonement", "clue": "A young girl's lie has devastating consequences for her older sister and her lover.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "The Wrestler", "clue": "An aging professional wrestler tries to reconnect with his estranged daughter and find a life outside the ring.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Dancer in the Dark", "clue": "A factory worker with a degenerative eye condition saves money for her son's operation, with tragic results.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Grave of the Fireflies", "clue": "Two siblings struggle to survive in Japan during the final months of World War II.", "category": "Emotional Damage", "emoji": "💔" },
    { "title": "Stranger Things", "clue": "Kids play D&D while actual interdimensional monsters terrorize their 80s town.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Office", "clue": "Documentary crew follows world's most incompetent boss and suffering employees.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Breaking Bad", "clue": "High school chemistry teacher becomes drug kingpin to pay medical bills.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Game of Thrones", "clue": "Multiple families fight for throne while ice zombies threaten everyone.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Crown", "clue": "British royal family navigates political changes and personal scandals across decades.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Ozark", "clue": "Financial advisor launders money for cartel while relocating family to Missouri.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "House of Cards", "clue": "Politician manipulates his way to presidency through murder and manipulation.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Narcos", "clue": "DEA agents chase Colombian drug lords during 80s cocaine epidemic.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Orange Is the New Black", "clue": "Privileged woman adapts to prison life after tax evasion conviction.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Witcher", "clue": "Monster hunter with white hair searches for his destiny across magical continent.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Squid Game", "clue": "Desperate people play children's games for money with deadly consequences.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Money Heist", "clue": "Criminal mastermind orchestrates elaborate heist on Spanish mint.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Lupin", "clue": "Gentleman thief seeks revenge against family that framed his father.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Queen's Gambit", "clue": "Orphan chess prodigy battles addiction while dominating male-dominated sport.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Bridgerton", "clue": "Regency-era romance with modern sensibilities and diverse casting choices.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Umbrella Academy", "clue": "Dysfunctional superhero siblings reunite to prevent apocalypse multiple times.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Dark", "clue": "German town's missing children mystery involves time travel across multiple generations.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Mindhunter", "clue": "FBI agents interview serial killers to understand criminal psychology.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Russian Doll", "clue": "Woman gets trapped in time loop dying repeatedly at her birthday party.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Mandalorian", "clue": "Bounty hunter protects alien child while navigating post-Empire galaxy.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Ted Lasso", "clue": "American football coach moves to England to manage soccer team despite ignorance.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Boys", "clue": "Vigilantes fight corrupt superheroes who abuse their powers for profit.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Euphoria", "clue": "Teen struggles with addiction while navigating high school relationships and identity.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Wednesday", "clue": "Gothic teen solves murders at supernatural boarding school while dancing viral TikTok moves.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "You", "clue": "Bookstore manager stalks women through social media and calls it romance.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Fleabag", "clue": "A grieving, witty woman navigates life and love in London while frequently breaking the fourth wall.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Marvelous Mrs. Maisel", "clue": "A 1950s housewife discovers she has a knack for stand-up comedy after her husband leaves her.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Severance", "clue": "Office workers undergo a procedure that surgically divides their memories between their work and personal lives.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Handmaid's Tale", "clue": "In a dystopian society, a fertile woman is forced into sexual servitude but fights back.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Black Mirror", "clue": "An anthology series exploring the dark side of technology and its impact on society.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Peaky Blinders", "clue": "A gangster family in 1920s Birmingham, England, rises to power.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Good Place", "clue": "A selfish woman dies and is mistakenly sent to a utopian afterlife, where she tries to become a better person.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Succession", "clue": "The dysfunctional children of a global media mogul vie for control of his company.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "The Bear", "clue": "A young, fine-dining chef returns to Chicago to run his family's sandwich shop.", "category": "Streaming Hits", "emoji": "📺" },
    { "title": "Only Murders in the Building", "clue": "Three true-crime podcast enthusiasts who live in the same apartment building team up to solve a murder.", "category": "Streaming Hits", "emoji": "📺" }
        ];


// --- GAME LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const game = new PlotTwistedGame();
    game.init();
});

class PlotTwistedGame {
    constructor() {
        this.allClues = [];
        this.categoryData = new Map();
        this.dom = {};
        this.state = {
            currentScreen: 'start',
            currentGameMode: 'standard',
            selectedCategory: null,
            lastPlayedCategory: '',
            gameQuestions: [],
            currentQuestionIndex: 0,
            playedQuestions: [],
            totalScore: 0,
            currentAnswer: '',
            guessedLetters: [],
            isRoundOver: false,
            strikesLeft: 3
        };
        this.settings = { darkMode: false, neonTheme: false, sound: false, numRounds: 5 };
        this.keyLayout = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')];
        this.synths = {};
        this.recognition = null;
        this.isListening = false;
        this._randomSeed = 0;
    }

    init() {
        this.allClues = cluesJSON;
        this.cacheDomElements();
        this.processCluesIntoCategories();
        this.loadSettings();
        this.applySettingsToUI();
        this.bindEventListeners();
        this.renderCategoryScreen();
        this.checkDailyChallengeStatus();
        this.showScreen('start');
    }

    getEl(id) { const el = document.getElementById(id); if (!el) console.warn(`Element with ID '${id}' not found.`); return el; }

    cacheDomElements() {
        this.dom = {
            screens: {
                start: this.getEl('startScreen'),
                moreModes: this.getEl('moreModesScreen'),
                settings: this.getEl('settingsScreen'),
                category: this.getEl('categoryScreen'),
                game: this.getEl('gameScreen'),
                gameOver: this.getEl('gameOverScreen'),
                credits: this.getEl('creditsScreen'),
                dailyChallenge: this.getEl('dailyChallengeScreen'),
                howToPlay: this.getEl('howToPlayScreen')
            },
            buttons: {
                startGameBtn: this.getEl('startGameBtn'),
                dailyChallengeBtn: this.getEl('dailyChallengeBtn'),
                moreModesBtn: this.getEl('moreModesBtn'),
                settingsBtn: this.getEl('settingsBtn'),
                howToPlayBtn: this.getEl('howToPlayBtn'),
                dailyChallengeBackBtn: this.getEl('dailyChallengeBackBtn'),
                moreModesBackBtn: this.getEl('moreModesBackBtn'),
                settingsBackBtn: this.getEl('settingsBackBtn'),
                howToPlayBackBtn: this.getEl('howToPlayBackBtn'),
                playBtn: this.getEl('playBtn'),
                categoryBackToHomeBtn: this.getEl('categoryBackToHomeBtn'),
                finishGameBtn: this.getEl('finishGameBtn'),
                playAgainBtn: this.getEl('playAgainBtn'),
                chooseNewCategoryBtn: this.getEl('chooseNewCategoryBtn'),
                gameOverBackToHomeBtn: this.getEl('gameOverBackToHomeBtn'),
                viewCreditsBtn: this.getEl('viewCreditsBtn'),
                creditsBackBtn: this.getEl('creditsBackBtn'),
                speakBtn: this.getEl('speakBtn'),
                skipBtn: this.getEl('skipBtn'),
                continueBtn: this.getEl('continueBtn'),
                confirmQuitBtn: this.getEl('confirmQuitBtn'),
                cancelQuitBtn: this.getEl('cancelQuitBtn'),
                shareScoreBtn: this.getEl('shareScoreBtn')
            },
            displays: {
                gameProgressDisplay: this.getEl('gameProgressDisplay'),
                gameScoreDisplay: this.getEl('gameScoreDisplay'),
                strikesDisplay: this.getEl('strikesDisplay'),
                clueText: this.getEl('clueText'),
                wordDisplay: document.querySelector('.word-display'),
                gameOverTitle: this.getEl('gameOverTitle'),
                finalScore: this.getEl('finalScore'),
                scoreBreakdown: this.getEl('scoreBreakdown'),
                creditsContent: this.getEl('creditsContent')
            },
            containers: {
                categoryGrid: document.querySelector('.category-grid'),
                keyboard: this.getEl('keyboard'),
                continueOverlay: this.getEl('continue-overlay'),
                confirmModal: this.getEl('confirmModal'),
                screenBox: document.querySelector('.screen-box')
            },
            settingsToggles: {
                darkMode: this.getEl('darkModeToggle'),
                neonTheme: this.getEl('neonThemeToggle'),
                sound: this.getEl('soundToggle'),
                gameLength: this.getEl('gameLengthSelector')
            }
        };
    }

    processCluesIntoCategories() {
        const categories = ["Family","Sci-Fi","Superhero","Fantasy","Emotional Damage","Streaming Hits"];
        this.categoryData.clear();
        categories.forEach(name => {
            const first = this.allClues.find(c => c.category===name);
            if (first) this.categoryData.set(name,{name,clues:this.allClues.filter(c=>c.category===name),emoji:first.emoji});
        });
    }

    loadSettings(){
        const s=localStorage.getItem('plotTwistedSettings');
        if(s)Object.assign(this.settings,JSON.parse(s));
    }
    saveSettings(){localStorage.setItem('plotTwistedSettings',JSON.stringify(this.settings));}

    applySettingsToUI(){
        document.body.classList.toggle('dark-mode',this.settings.darkMode);
        document.body.classList.toggle('neon-theme',this.settings.neonTheme);
        this.dom.settingsToggles.darkMode.classList.toggle('active',this.settings.darkMode);
        this.dom.settingsToggles.neonTheme.classList.toggle('active',this.settings.neonTheme);
        this.dom.settingsToggles.sound.classList.toggle('active',this.settings.sound);
        if(this.settings.sound)ensureTone(this);
        this.dom.settingsToggles.gameLength.querySelectorAll('.length-btn').forEach(btn=>btn.classList.toggle('selected',parseInt(btn.dataset.count)===this.settings.numRounds));
    }

    bindEventListeners(){
        const listeners=[
            {el:this.dom.buttons.startGameBtn,fn:()=>this.showScreen('category')},
            {el:this.dom.buttons.settingsBtn,fn:()=>this.showScreen('settings')},
            {el:this.dom.buttons.howToPlayBtn,fn:()=>this.showScreen('howToPlay')},
            {el:this.dom.buttons.dailyChallengeBtn,fn:()=>this.startDailyChallenge()},
            {el:this.dom.buttons.moreModesBtn,fn:()=>this.showScreen('moreModes')},
            {el:this.dom.buttons.settingsBackBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.howToPlayBackBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.dailyChallengeBackBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.moreModesBackBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.categoryBackToHomeBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.gameOverBackToHomeBtn,fn:()=>this.showScreen('start')},
            {el:this.dom.buttons.creditsBackBtn,fn:()=>this.showScreen('gameOver')},
            {el:this.dom.buttons.playBtn,fn:()=>this.startGame()},
            {el:this.dom.buttons.skipBtn,fn:()=>this.skipQuestion()},
            {el:this.dom.buttons.continueBtn,fn:()=>this.nextQuestion()},
            {el:this.dom.buttons.finishGameBtn,fn:()=>this.dom.containers.confirmModal.classList.add('active')},
            {el:this.dom.buttons.speakBtn,fn:()=>this.toggleSpeechRecognition()},
            {el:this.dom.buttons.playAgainBtn,fn:()=>this.playAgain()},
            {el:this.dom.buttons.chooseNewCategoryBtn,fn:()=>this.showScreen('category')},
            {el:this.dom.buttons.viewCreditsBtn,fn:()=>this.showCredits()},
            {el:this.dom.buttons.shareScoreBtn,fn:()=>this.shareDailyScore()},
            {el:this.dom.buttons.confirmQuitBtn,fn:()=>{this.dom.containers.confirmModal.classList.remove('active');this.endGame(true);}},
            {el:this.dom.buttons.cancelQuitBtn,fn:()=>this.dom.containers.confirmModal.classList.remove('active')}
        ];listeners.forEach(({el,fn})=>{if(el)el.addEventListener('click',fn)});
        if(this.dom.containers.categoryGrid)this.dom.containers.categoryGrid.addEventListener('click',e=>{const b=e.target.closest('.category-btn');if(b)this.selectCategory(b.dataset.category)});
    }

    showScreen(name){Object.values(this.dom.screens).forEach(s=>s.classList.remove('active'));if(this.dom.screens[name]){this.dom.screens[name].classList.add('active');this.state.currentScreen=name;}if(name==='category'){this.state.selectedCategory=null;this.renderCategoryScreen()}}

    renderCategoryScreen(){const grid=this.dom.containers.categoryGrid;grid.innerHTML='';this.dom.buttons.playBtn.disabled=true;this.categoryData.forEach(cat=>{const btn=document.createElement('button');btn.className='category-btn';btn.dataset.category=cat.name;btn.innerHTML=`<div class="poster-emoji">${cat.emoji}</div><div class="tape-label">${cat.name}</div>`;grid.appendChild(btn)})}

    selectCategory(category){this.state.selectedCategory=category;this.dom.containers.categoryGrid.querySelectorAll('.category-btn').forEach(btn=>btn.classList.toggle('selected',btn.dataset.category===category));this.dom.buttons.playBtn.disabled=false;this.playSound('click')}

    startGame(){if(!this.state.selectedCategory)return;this.state.currentGameMode='standard';this.resetGameState();let available=this.getAvailableClues(this.state.selectedCategory);if(available.length<this.settings.numRounds){alert(`You've completed the ${this.state.selectedCategory} category! Resetting clues.`);this.resetSeenClues(this.state.selectedCategory);available=this.getAvailableClues(this.state.selectedCategory)}this.state.gameQuestions=this.shuffleArray(available).slice(0,this.settings.numRounds);if(!this.state.gameQuestions.length){alert('Not enough questions!');return;}this.state.lastPlayedCategory=this.state.selectedCategory;this.state.currentQuestionIndex=0;this.showScreen('game');this.nextQuestion();this.playSound('start')}

    resetGameState(){this.state.totalScore=0;this.state.playedQuestions=[];this.state.strikesLeft=3}

    nextQuestion(){if(this.state.currentQuestionIndex>=this.state.gameQuestions.length){this.endGame();return}const q=this.state.gameQuestions[this.state.currentQuestionIndex];this.state.currentAnswer=q.title.toUpperCase();this.state.guessedLetters=[];this.state.isRoundOver=false;this.dom.displays.clueText.innerHTML=`<span class="clue-feedback">${q.clue}</span>`;this.dom.containers.continueOverlay.classList.remove('visible');this.updateWordDisplay();this.renderKeyboard();this.updateGameStatusDisplay();this.state.currentQuestionIndex++}

    updateWordDisplay(){const ans=this.state.currentAnswer;this.dom.displays.wordDisplay.textContent=ans.split('').map(c=>c===' '?" ":(!/^[A-Z0-9]$/.test(c)?c:(this.state.guessedLetters.includes(c)?c:'_'))).join('')}

    renderKeyboard(){const kb=this.dom.containers.keyboard;kb.innerHTML='';this.keyLayout.forEach(row=>{const rd=document.createElement('div');rd.className='keyboard-row';row.forEach(k=>{const b=document.createElement('button');b.className='key';b.textContent=k;b.dataset.key=k;if(this.state.guessedLetters.includes(k))b.classList.add('disabled');b.addEventListener('click',()=>this.handleKeyPress(k));rd.appendChild(b)});kb.appendChild(rd)})}

    handleKeyPress(k){if(this.state.isRoundOver||this.state.guessedLetters.includes(k))return;this.state.guessedLetters.push(k);this.renderKeyboard();if(this.state.currentAnswer.includes(k)){this.playSound('correct');this.updateWordDisplay();this.checkForWin()}else{this.playSound('incorrect');this.state.strikesLeft--;this.updateGameStatusDisplay();this.dom.containers.screenBox.classList.add('animate-shake');setTimeout(()=>this.dom.containers.screenBox.classList.remove('animate-shake'),500);if(this.state.strikesLeft<=0)this.endGame(true)}}

    checkForWin(){const d=this.dom.displays.wordDisplay.textContent;if(!d.includes('_')){this.state.isRoundOver=true;this.state.totalScore+=100;const cq=this.state.gameQuestions[this.state.currentQuestionIndex-1];this.state.playedQuestions.push({...cq,status:'correct'});this.markClueAsSeen(this.state.selectedCategory,cq.title);this.dom.displays.clueText.innerHTML='<span class="clue-feedback correct">Correct!</span>';this.dom.containers.continueOverlay.classList.add('visible');this.playSound('winRound')}}

    skipQuestion(){if(this.state.isRoundOver)return;this.state.isRoundOver=true;const cq=this.state.gameQuestions[this.state.currentQuestionIndex-1];this.state.playedQuestions.push({...cq,status:'skipped'});this.markClueAsSeen(this.state.selectedCategory,cq.title);this.dom.displays.clueText.innerHTML=`<span class="clue-feedback incorrect">Skipped! The answer was: ${this.state.currentAnswer}</span>`;this.disableKeyboard();this.dom.buttons.skipBtn.disabled=true;this.dom.containers.continueOverlay.classList.add('visible');this.playSound('skip')}

    updateGameStatusDisplay(){this.dom.displays.gameProgressDisplay.textContent=`Question: ${this.state.currentQuestionIndex+1} / ${this.state.gameQuestions.length}`;this.dom.displays.gameScoreDisplay.textContent=`Score: ${this.state.totalScore}`;this.dom.buttons.skipBtn.disabled=this.state.isRoundOver;const sc=this.dom.displays.strikesDisplay;sc.innerHTML='';for(let i=0;i<3;i++){const icon=document.createElement('i');icon.className='ph ph-ticket';if(i>=this.state.strikesLeft)icon.classList.add('used');sc.appendChild(icon)}}

    endGame(q=false){this.dom.displays.gameOverTitle.textContent=q?"Game Over":"Your Final Cut";if(this.state.currentGameMode==='daily'){localStorage.setItem('pt_daily_played_'+new Date().toDateString(),'true');this.checkDailyChallengeStatus();const c=this.state.playedQuestions.filter(x=>x.status==='correct').length;this.dom.displays.finalScore.textContent=`${c} / 10`;this.dom.buttons.playAgainBtn.style.display='none';this.dom.buttons.chooseNewCategoryBtn.style.display='none';this.dom.buttons.shareScoreBtn.style.display='inline-block'}else{this.dom.displays.finalScore.textContent=this.state.totalScore;this.dom.buttons.playAgainBtn.style.display='inline-block';this.dom.buttons.chooseNewCategoryBtn.style.display='inline-block';this.dom.buttons.shareScoreBtn.style.display='none'}const bl=this.dom.displays.scoreBreakdown;bl.innerHTML='';this.state.playedQuestions.forEach(q=>{const li=document.createElement('li');const p=q.status==='correct'?'+100':'+0';li.innerHTML=`<span>${q.title}</span><span>${p}</span>`;bl.appendChild(li)});this.showScreen('gameOver');this.playSound('endGame')}

    playAgain(){this.showScreen('category')}

    showCredits(){const c=this.dom.displays.creditsContent;c.innerHTML='';this.state.playedQuestions.forEach(q=>{const i=document.createElement('div');i.className='credit-item';const sc=q.status==='correct'?'status-correct':'status-incorrect';i.innerHTML=`<div class="title">${q.title}</div><div class="clue">"${q.clue}"</div><div class="${sc}">${q.status.toUpperCase()}</div>`;c.appendChild(i)});this.showScreen('credits')}

    shuffleArray(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()* (i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr}

    setupSounds(){if(window.Tone&&Object.keys(this.synths).length===0){this.synths.click=new Tone.Synth({oscillator:{type:'sine'},envelope:{attack:0.01,decay:0.1,sustain:0,release:0.1}}).toDestination();this.synths.correct=new Tone.Synth({oscillator:{type:'triangle'},envelope:{attack:0.01,decay:0.2,sustain:0,release:0.2}}).toDestination();this.synths.incorrect=new Tone.Synth({oscillator:{type:'square'},envelope:{attack:0.01,decay:0.3,sustain:0,release:0.2}}).toDestination();this.synths.winRound=new Tone.PolySynth(Tone.Synth,{oscillator:{type:'fatsawtooth'},envelope:{attack:0.01,decay:0.4,sustain:0,release:0.2}}).toDestination();this.synths.skip=new Tone.Synth({oscillator:{type:'square'},envelope:{attack:0.2,decay:0.2,sustain:0,release:0.1}}).toDestination();this.synths.endGame=new Tone.Synth({oscillator:{type:'sine'},envelope:{attack:0.1,decay:0.5,sustain:0,release:0.2}}).toDestination();}}

    playSound(s){if(!this.settings.sound||!window.Tone)return;this.setupSounds();if(!this.synths[s])return;Tone.start().then(()=>{switch(s){case'click':this.synths.click.triggerAttackRelease('C5','8n');break;case'correct':this.synths.correct.triggerAttackRelease('G5','8n');break;case'incorrect':this.synths.incorrect.triggerAttackRelease('C3','8n');break;case'winRound':this.synths.winRound.triggerAttackRelease(['C4','E4','G4','C5'],'8n');break;case'skip':this.synths.skip.triggerAttackRelease('F3','8n');break;case'endGame':this.synths.endGame.triggerAttackRelease('C2','2n');break}})}

    toggleSpeechRecognition(){alert('Speech recognition coming soon!')}

    checkDailyChallengeStatus(){try{const k='pt_daily_played_'+new Date().toDateString();const p=localStorage.getItem(k);const b=this.dom.buttons.dailyChallengeBtn;if(b){b.disabled=!!p;b.textContent=p?'Daily ✅':'Daily Challenge';b.setAttribute('aria-pressed',!!p)}}catch(e){console.error('Error checking daily challenge status:',e)}}

    startDailyChallenge(){try{const k='pt_daily_played_'+new Date().toDateString();if(localStorage.getItem(k)){alert("You've already completed today's challenge!");return;}this.state.currentGameMode='daily';this.resetGameState();this.state.gameQuestions=this.getDailyQuestions();this.state.currentQuestionIndex=0;this.showScreen('game');this.nextQuestion();this.playSound('start')}catch(e){console.error('Failed to start daily challenge:',e)}}

    getDailyQuestions(){const d=new Date();this._randomSeed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();let sh=[...this.allClues];for(let i=sh.length-1;i>0;i--){const j=Math.floor(this.seededRandom()*(i+1));[sh[i],sh[j]]=[sh[j],sh[i]];}return sh.slice(0,10)}

    seededRandom(){this._randomSeed=(this._randomSeed*9301+49297)%233280;return this._randomSeed/233280}

    shareDailyScore(){const c=this.state.playedQuestions.filter(q=>q.status==='correct').length;const eg=this.state.playedQuestions.map(q=>q.status==='correct'?'🟩':q.status==='skipped'?'🟨':'🟥').join('');const t=new Date();const ds=`${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`;const st=`Plot Twisted - Daily Challenge ${ds}\n\nI got ${c}/10 correct!\n\n🎬 ${eg}\n\nCan you beat my score?`;if(navigator.clipboard){navigator.clipboard.writeText(st).then(()=>{this.showCopiedFeedback()}).catch(()=>{this.copyTextFallback(st)})}else this.copyTextFallback(st)}

    copyTextFallback(text){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.top='0';ta.style.left='0';document.body.appendChild(ta);ta.focus();ta.select();try{const ok=document.execCommand('copy');if(ok)this.showCopiedFeedback();}catch(e){console.error('Fallback copy failed:',e);}document.body.removeChild(ta)}

    showCopiedFeedback(){const btn=this.dom.buttons.shareScoreBtn;const orig=btn.textContent;btn.textContent='Copied!';btn.disabled=true;setTimeout(()=>{btn.textContent=orig;btn.disabled=false},2000)}

    getSeenClues(category){try{const s=localStorage.getItem(`seenClues_${category}`);return s?JSON.parse(s):[]}catch(e){console.error('Could not get seen clues',e);return[]}}

    markClueAsSeen(category,title){try{if(this.state.currentGameMode==='daily')return;const seen=this.getSeenClues(category);if(!seen.includes(title)){seen.push(title);localStorage.setItem(`seenClues_${category}`,JSON.stringify(seen))}}catch(e){console.error('Could not save seen clue to localStorage',e)}}

    resetSeenClues(category){try{localStorage.removeItem(`seenClues_${category}`)}catch(e){console.error('Could not reset seen clues',e)}}
}

// Instantiate the game once the DOM is ready
document.addEventListener('DOMContentLoaded',()=>{const game=new PlotTwistedGame();game.init()});
