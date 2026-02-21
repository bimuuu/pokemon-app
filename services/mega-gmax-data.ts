import { FormTransformationCondition } from '@/types/pokemon'

/**
 * Mega Evolution and Gigantamax transformation data
 * This contains the hardcoded transformation conditions for Mega/Gmax forms
 */
export const megaGmaxData: Record<string, FormTransformationCondition[]> = {
  // Mega Evolution (handled separately)
  'charizard': [
    { type: 'mega', trigger: 'charizardite-x', description: 'formTransformations.charizard.megaX' },
    { type: 'mega', trigger: 'charizardite-y', description: 'formTransformations.charizard.megaY' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.charizard.gmax' },
  ],
  'charizard-mega-x': [
    { type: 'mega', trigger: 'charizardite-x', description: 'formTransformations.charizard.megaXDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.charizard.megaBattle' },
  ],
  'charizard-mega-y': [
    { type: 'mega', trigger: 'charizardite-y', description: 'formTransformations.charizard.megaYDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.charizard.megaBattle' },
  ],
  'charizard-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.charizard.gmaxDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.charizard.gmaxBattle' },
  ],

  'mewtwo': [
    { type: 'mega', trigger: 'mewtwonite-x', description: 'formTransformations.mewtwo.megaX' },
    { type: 'mega', trigger: 'mewtwonite-y', description: 'formTransformations.mewtwo.megaY' },
  ],
  'mewtwo-mega-x': [
    { type: 'mega', trigger: 'mewtwonite-x', description: 'formTransformations.mewtwo.megaXDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.mewtwo.megaBattle' },
  ],
  'mewtwo-mega-y': [
    { type: 'mega', trigger: 'mewtwonite-y', description: 'formTransformations.mewtwo.megaYDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.mewtwo.megaBattle' },
  ],

  'rayquaza': [
    { type: 'mega', trigger: 'meteorite', description: 'formTransformations.rayquaza.mega' },
  ],
  'rayquaza-mega': [
    { type: 'mega', trigger: 'meteorite', description: 'formTransformations.rayquaza.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.rayquaza.megaBattle' },
  ],

  // Single Mega Evolution Pokemon
  'blastoise': [
    { type: 'mega', trigger: 'blastoisinite', description: 'formTransformations.blastoise.mega' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.blastoise.gmax' },
  ],
  'blastoise-mega': [
    { type: 'mega', trigger: 'blastoisinite', description: 'formTransformations.blastoise.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.blastoise.megaBattle' },
  ],
  'blastoise-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.blastoise.gmaxDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.blastoise.gmaxBattle' },
  ],

  'venusaur': [
    { type: 'mega', trigger: 'venusaurite', description: 'formTransformations.venusaur.mega' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.venusaur.gmax' },
  ],
  'venusaur-mega': [
    { type: 'mega', trigger: 'venusaurite', description: 'formTransformations.venusaur.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.venusaur.megaBattle' },
  ],
  'venusaur-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.venusaur.gmaxDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.venusaur.gmaxBattle' },
  ],

  'alakazam': [
    { type: 'mega', trigger: 'alakazite', description: 'formTransformations.alakazam.mega' },
  ],
  'alakazam-mega': [
    { type: 'mega', trigger: 'alakazite', description: 'formTransformations.alakazam.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.alakazam.megaBattle' },
  ],

  'gengar': [
    { type: 'mega', trigger: 'gengarite', description: 'formTransformations.gengar.mega' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gengar.gmax' },
  ],
  'gengar-mega': [
    { type: 'mega', trigger: 'gengarite', description: 'formTransformations.gengar.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.gengar.megaBattle' },
  ],
  'gengar-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gengar.gmaxDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gengar.gmaxBattle' },
  ],

  // Gigantamax Pokemon
  'butterfree': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.butterfree' },
  ],
  'butterfree-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.butterfreeDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'pikachu': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.pikachu' },
  ],
  'pikachu-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.pikachuDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'meowth': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.meowth' },
  ],
  'meowth-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.meowthDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'machamp': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.machamp' },
  ],
  'machamp-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.machampDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'kingler': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.kingler' },
  ],
  'kingler-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.kinglerDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'lapras': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.lapras' },
  ],
  'lapras-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.laprasDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'eevee': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.eevee' },
  ],
  'eevee-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.eeveeDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'snorlax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.snorlax' },
  ],
  'snorlax-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.snorlaxDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'garbodor': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.garbodor' },
  ],
  'garbodor-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.garbodorDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'melmetal': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.melmetal' },
  ],
  'melmetal-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.melmetalDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'corviknight': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.corviknight' },
  ],
  'corviknight-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.corviknightDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'orbeetle': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.orbeetle' },
  ],
  'orbeetle-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.orbeetleDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'duraludon': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.duraludon' },
  ],
  'duraludon-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.duraludonDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'coalossal': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.coalossal' },
  ],
  'coalossal-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.coalossalDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'flapple': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.flapple' },
  ],
  'flapple-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.flappleDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'appletun': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.appletun' },
  ],
  'appletun-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.appletunDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'sandaconda': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.sandaconda' },
  ],
  'sandaconda-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.sandacondaDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'centiskorch': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.centiskorch' },
  ],
  'centiskorch-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.centiskorchDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'hatterene': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.hatterene' },
  ],
  'hatterene-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.hattereneDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'grimmsnarl': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.grimmsnarl' },
  ],
  'grimmsnarl-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.grimmsnarlDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'copperajah': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.copperajah' },
  ],
  'copperajah-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.copperajahDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'drednaw': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.drednaw' },
  ],
  'drednaw-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.drednawDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'urshifu': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.urshifu' },
  ],
  'urshifu-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.urshifuDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'rillaboom': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.rillaboom' },
  ],
  'rillaboom-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.rillaboomDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'cinderace': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.cinderace' },
  ],
  'cinderace-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.cinderaceDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'inteleon': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.inteleon' },
  ],
  'inteleon-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.inteleonDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'seismitoad': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.seismitoad' },
  ],
  'seismitoad-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.seismitoadDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'dracovish': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.dracovish' },
  ],
  'dracovish-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.dracovishDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'arctozolt': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.arctozolt' },
  ],
  'arctozolt-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.arctozoltDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'dracozolt': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.dracozolt' },
  ],
  'dracozolt-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.dracozoltDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'arctovish': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.arctovish' },
  ],
  'arctovish-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.arctovishDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],
  'dragonite': [
    { type: 'mega', trigger: 'dragonite', description: 'formTransformations.dragonite.mega' },
  ],
  'dragonite-mega': [
    { type: 'mega', trigger: 'dragonite', description: 'formTransformations.dragonite.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.dragonite.megaBattle' },
  ],

  'golisopod': [
    { type: 'mega', trigger: 'golisopod', description: 'formTransformations.golisopod.mega' },
  ],
  'golisopod-mega': [
    { type: 'mega', trigger: 'golisopod', description: 'formTransformations.golisopod.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.golisopod.megaBattle' },
  ],

  'scovillain': [
    { type: 'mega', trigger: 'scovillain', description: 'formTransformations.scovillain.mega' },
  ],
  'scovillain-mega': [
    { type: 'mega', trigger: 'scovillain', description: 'formTransformations.scovillain.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.scovillain.megaBattle' },
  ],

  'kyogre': [
    { type: 'mega', trigger: 'blue-orb', description: 'formTransformations.kyogre.primal' },
  ],
  'kyogre-primal': [
    { type: 'mega', trigger: 'blue-orb', description: 'formTransformations.kyogre.primalDesc' },
    { type: 'battle', trigger: 'primal-reversion', description: 'formTransformations.kyogre.primalBattle' },
  ],

  'kangaskhan': [
    { type: 'mega', trigger: 'kangaskhanite', description: 'formTransformations.kangaskhan.mega' },
  ],
  'kangaskhan-mega': [
    { type: 'mega', trigger: 'kangaskhanite', description: 'formTransformations.kangaskhan.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.kangaskhan.megaBattle' },
  ],

  'scizor': [
    { type: 'mega', trigger: 'scizorite', description: 'formTransformations.scizor.mega' },
  ],
  'scizor-mega': [
    { type: 'mega', trigger: 'scizorite', description: 'formTransformations.scizor.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.scizor.megaBattle' },
  ],

  'blaziken': [
    { type: 'mega', trigger: 'blazikenite', description: 'formTransformations.blaziken.mega' },
  ],
  'blaziken-mega': [
    { type: 'mega', trigger: 'blazikenite', description: 'formTransformations.blaziken.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.blaziken.megaBattle' },
  ],

  'medicham': [
    { type: 'mega', trigger: 'medichamite', description: 'formTransformations.medicham.mega' },
  ],
  'medicham-mega': [
    { type: 'mega', trigger: 'medichamite', description: 'formTransformations.medicham.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.medicham.megaBattle' },
  ],

  'chimecho': [
    { type: 'mega', trigger: 'chimechoite', description: 'formTransformations.chimecho.mega' },
  ],
  'chimecho-mega': [
    { type: 'mega', trigger: 'chimechoite', description: 'formTransformations.chimecho.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.chimecho.megaBattle' },
  ],

  'latias': [
    { type: 'mega', trigger: 'latiasite', description: 'formTransformations.latias.mega' },
  ],
  'latias-mega': [
    { type: 'mega', trigger: 'latiasite', description: 'formTransformations.latias.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.latias.megaBattle' },
  ],

  'garchomp-z': [
    { type: 'mega', trigger: 'garchompite-z', description: 'formTransformations.garchomp.megaZ' },
  ],
  'garchomp-mega-z': [
    { type: 'mega', trigger: 'garchompite-z', description: 'formTransformations.garchomp.megaZDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.garchomp.megaZBattle' },
  ],

  'heatran': [
    { type: 'mega', trigger: 'heatranite', description: 'formTransformations.heatran.mega' },
  ],
  'heatran-mega': [
    { type: 'mega', trigger: 'heatranite', description: 'formTransformations.heatran.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.heatran.megaBattle' },
  ],

  'scrafty': [
    { type: 'mega', trigger: 'scraftyite', description: 'formTransformations.scrafty.mega' },
  ],
  'scrafty-mega': [
    { type: 'mega', trigger: 'scraftyite', description: 'formTransformations.scrafty.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.scrafty.megaBattle' },
  ],

  'greninja': [
    { type: 'mega', trigger: 'greninjite', description: 'formTransformations.greninja.mega' },
  ],
  'greninja-mega': [
    { type: 'mega', trigger: 'greninjite', description: 'formTransformations.greninja.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.greninja.megaBattle' },
  ],

  'dragalge': [
    { type: 'mega', trigger: 'dragalgeite', description: 'formTransformations.dragalge.mega' },
  ],
  'dragalge-mega': [
    { type: 'mega', trigger: 'dragalgeite', description: 'formTransformations.dragalge.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.dragalge.megaBattle' },
  ],

  'drampa': [
    { type: 'mega', trigger: 'drampite', description: 'formTransformations.drampa.mega' },
  ],
  'drampa-mega': [
    { type: 'mega', trigger: 'drampite', description: 'formTransformations.drampa.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.drampa.megaBattle' },
  ],

  'glimmora': [
    { type: 'mega', trigger: 'glimmorite', description: 'formTransformations.glimmora.mega' },
  ],
  'glimmora-mega': [
    { type: 'mega', trigger: 'glimmorite', description: 'formTransformations.glimmora.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.glimmora.megaBattle' },
  ],

  'groudon': [
    { type: 'mega', trigger: 'red-orb', description: 'formTransformations.groudon.primal' },
  ],
  'groudon-primal': [
    { type: 'mega', trigger: 'red-orb', description: 'formTransformations.groudon.primalDesc' },
    { type: 'battle', trigger: 'primal-reversion', description: 'formTransformations.groudon.primalBattle' },
  ],

  'banette': [
    { type: 'mega', trigger: 'banettite', description: 'formTransformations.banette.mega' },
  ],
  'banette-mega': [
    { type: 'mega', trigger: 'banettite', description: 'formTransformations.banette.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.banette.megaBattle' },
  ],

  'metagross': [
    { type: 'mega', trigger: 'metagrossite', description: 'formTransformations.metagross.mega' },
  ],
  'metagross-mega': [
    { type: 'mega', trigger: 'metagrossite', description: 'formTransformations.metagross.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.metagross.megaBattle' },
  ],

  'garchomp': [
    { type: 'mega', trigger: 'garchompite', description: 'formTransformations.garchomp.mega' },
  ],
  'garchomp-mega': [
    { type: 'mega', trigger: 'garchompite', description: 'formTransformations.garchomp.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.garchomp.megaBattle' },
  ],

  'froslass': [
    { type: 'mega', trigger: 'froslassite', description: 'formTransformations.froslass.mega' },
  ],
  'froslass-mega': [
    { type: 'mega', trigger: 'froslassite', description: 'formTransformations.froslass.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.froslass.megaBattle' },
  ],

  'scolipede': [
    { type: 'mega', trigger: 'scolipede', description: 'formTransformations.scolipede.mega' },
  ],
  'scolipede-mega': [
    { type: 'mega', trigger: 'scolipede', description: 'formTransformations.scolipede.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.scolipede.megaBattle' },
  ],

  'delphox': [
    { type: 'mega', trigger: 'delphox', description: 'formTransformations.delphox.mega' },
  ],
  'delphox-mega': [
    { type: 'mega', trigger: 'delphox', description: 'formTransformations.delphox.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.delphox.megaBattle' },
  ],

  'barbaracle': [
    { type: 'mega', trigger: 'barbaracle', description: 'formTransformations.barbaracle.mega' },
  ],
  'barbaracle-mega': [
    { type: 'mega', trigger: 'barbaracle', description: 'formTransformations.barbaracle.megaDesc' },
    { type: 'battle', trigger: 'mega-evolution', description: 'formTransformations.barbaracle.megaBattle' },
  ],

  // Additional Gigantamax forms
  'toxtricity': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.toxtricity' },
  ],
  'toxtricity-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.toxtricityDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],

  'alcremie': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.alcremie' },
  ],
  'alcremie-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.gmax.alcremieDesc' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.gmax.gmaxBattle' },
  ],
};
