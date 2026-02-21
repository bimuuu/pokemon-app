import { FormTransformationCondition } from '@/types/pokemon'

/**
 * Raw transformation data for Pokemon forms
 * This contains the hardcoded transformation conditions that will be internationalized
 */
export const transformationData: Record<string, FormTransformationCondition[]> = {
  // Arceus - Plate-based transformations
  'arceus': [
    { type: 'item', trigger: 'flame-plate', description: 'formTransformations.arceus.flamePlate' },
    { type: 'item', trigger: 'splash-plate', description: 'formTransformations.arceus.splashPlate' },
    { type: 'item', trigger: 'zap-plate', description: 'formTransformations.arceus.zapPlate' },
    { type: 'item', trigger: 'meadow-plate', description: 'formTransformations.arceus.meadowPlate' },
    { type: 'item', trigger: 'icicle-plate', description: 'formTransformations.arceus.iciclePlate' },
    { type: 'item', trigger: 'fist-plate', description: 'formTransformations.arceus.fistPlate' },
    { type: 'item', trigger: 'toxic-plate', description: 'formTransformations.arceus.toxicPlate' },
    { type: 'item', trigger: 'earth-plate', description: 'formTransformations.arceus.earthPlate' },
    { type: 'item', trigger: 'sky-plate', description: 'formTransformations.arceus.skyPlate' },
    { type: 'item', trigger: 'mind-plate', description: 'formTransformations.arceus.mindPlate' },
    { type: 'item', trigger: 'insect-plate', description: 'formTransformations.arceus.insectPlate' },
    { type: 'item', trigger: 'stone-plate', description: 'formTransformations.arceus.stonePlate' },
    { type: 'item', trigger: 'spooky-plate', description: 'formTransformations.arceus.spookyPlate' },
    { type: 'item', trigger: 'draco-plate', description: 'formTransformations.arceus.dracoPlate' },
    { type: 'item', trigger: 'dread-plate', description: 'formTransformations.arceus.dreadPlate' },
    { type: 'item', trigger: 'iron-plate', description: 'formTransformations.arceus.ironPlate' },
    { type: 'item', trigger: 'pixie-plate', description: 'formTransformations.arceus.pixiePlate' },
  ],

  // Giratina - Griseous Orb transformation
  'giratina': [
    { type: 'item', trigger: 'griseous-orb', description: 'formTransformations.giratina.griseousOrb' },
  ],

  // Giratina Forms - Individual form conditions
  'giratina-altered': [
    { type: 'location', trigger: 'distortion-world', description: 'formTransformations.giratina.alteredLocation' },
    { type: 'item', trigger: 'griseous-orb', description: 'formTransformations.giratina.transformToOrigin' },
  ],
  'giratina-origin': [
    { type: 'location', trigger: 'distortion-world', description: 'formTransformations.giratina.originLocation' },
    { type: 'item', trigger: 'griseous-orb', description: 'formTransformations.giratina.transformToAltered' },
  ],

  // Shaymin - Gracidea Flower transformation
  'shaymin': [
    { type: 'item', trigger: 'gracidea', description: 'formTransformations.shaymin.gracidea' },
  ],

  // Shaymin Forms - Individual form conditions
  'shaymin-land': [
    { type: 'location', trigger: 'daytime', description: 'formTransformations.shaymin.landLocation' },
    { type: 'item', trigger: 'gracidea', description: 'formTransformations.shaymin.transformToSky' },
  ],
  'shaymin-sky': [
    { type: 'location', trigger: 'nighttime', description: 'formTransformations.shaymin.revertToLand' },
    { type: 'item', trigger: 'gracidea', description: 'formTransformations.shaymin.skyActive' },
  ],

  // Deoxys - Meteorite-based transformations
  'deoxys': [
    { type: 'location', trigger: 'birth-island', description: 'formTransformations.deoxys.birthIsland' },
    { type: 'location', trigger: 'meteorite', description: 'formTransformations.deoxys.meteorite' },
  ],

  // Deoxys Forms - Individual form conditions
  'deoxys-normal': [
    { type: 'location', trigger: 'birth-island', description: 'formTransformations.deoxys.normalBirthIsland' },
    { type: 'item', trigger: 'meteorite', description: 'formTransformations.deoxys.transformWithMeteorite' },
  ],
  'deoxys-attack': [
    { type: 'item', trigger: 'meteorite', description: 'formTransformations.deoxys.attackForm' },
    { type: 'location', trigger: 'birth-island', description: 'formTransformations.deoxys.backToNormal' },
  ],
  'deoxys-defense': [
    { type: 'item', trigger: 'meteorite', description: 'formTransformations.deoxys.defenseForm' },
    { type: 'location', trigger: 'birth-island', description: 'formTransformations.deoxys.backToNormal' },
  ],
  'deoxys-speed': [
    { type: 'item', trigger: 'meteorite', description: 'formTransformations.deoxys.speedForm' },
    { type: 'location', trigger: 'birth-island', description: 'formTransformations.deoxys.backToNormal' },
  ],

  // Rotom - Key-based transformations
  'rotom': [
    { type: 'item', trigger: 'heat-rotom', description: 'formTransformations.rotom.heatKey' },
    { type: 'item', trigger: 'wash-rotom', description: 'formTransformations.rotom.washKey' },
    { type: 'item', trigger: 'frost-rotom', description: 'formTransformations.rotom.frostKey' },
    { type: 'item', trigger: 'fan-rotom', description: 'formTransformations.rotom.fanKey' },
    { type: 'item', trigger: 'mow-rotom', description: 'formTransformations.rotom.mowKey' },
  ],

  // Rotom Forms - Individual form conditions
  'rotom-heat': [
    { type: 'item', trigger: 'heat-rotom', description: 'formTransformations.rotom.heatForm' },
    { type: 'location', trigger: 'appliances', description: 'formTransformations.rotom.revertBase' },
  ],
  'rotom-wash': [
    { type: 'item', trigger: 'wash-rotom', description: 'formTransformations.rotom.washForm' },
    { type: 'location', trigger: 'appliances', description: 'formTransformations.rotom.revertBase' },
  ],
  'rotom-frost': [
    { type: 'item', trigger: 'frost-rotom', description: 'formTransformations.rotom.frostForm' },
    { type: 'location', trigger: 'appliances', description: 'formTransformations.rotom.revertBase' },
  ],
  'rotom-fan': [
    { type: 'item', trigger: 'fan-rotom', description: 'formTransformations.rotom.fanForm' },
    { type: 'location', trigger: 'appliances', description: 'formTransformations.rotom.revertBase' },
  ],
  'rotom-mow': [
    { type: 'item', trigger: 'mow-rotom', description: 'formTransformations.rotom.mowForm' },
    { type: 'location', trigger: 'appliances', description: 'formTransformations.rotom.revertBase' },
  ],

  // Castform - Weather-based transformations
  'castform': [
    { type: 'weather', trigger: 'sunny', description: 'formTransformations.castform.sunny' },
    { type: 'weather', trigger: 'rainy', description: 'formTransformations.castform.rainy' },
    { type: 'weather', trigger: 'snowy', description: 'formTransformations.castform.snowy' },
    { type: 'weather', trigger: 'cloudy', description: 'formTransformations.castform.cloudy' },
  ],

  // Kyogre - Primal Reversion transformation
  'kyogre': [
    { type: 'item', trigger: 'blue-orb', description: 'formTransformations.kyogre.blueOrb' },
  ],

  // Kyogre Forms - Individual form conditions
  'kyogre-primal': [
    { type: 'item', trigger: 'blue-orb', description: 'formTransformations.kyogre.primalKyogre' },
    { type: 'ability', trigger: 'primordial-sea', description: 'formTransformations.kyogre.primordialSea' },
    { type: 'location', trigger: 'battle-end', description: 'formTransformations.kyogre.revertAfterBattle' },
  ],

  // Groudon - Primal Reversion transformation
  'groudon': [
    { type: 'item', trigger: 'red-orb', description: 'formTransformations.groudon.redOrb' },
  ],

  // Groudon Forms - Individual form conditions
  'groudon-primal': [
    { type: 'item', trigger: 'red-orb', description: 'formTransformations.groudon.primalGroudon' },
    { type: 'ability', trigger: 'desolate-land', description: 'formTransformations.groudon.desolateLand' },
    { type: 'location', trigger: 'battle-end', description: 'formTransformations.groudon.revertAfterBattle' },
  ],

  // Wishiwashi - Ability-based transformation
  'wishiwashi': [
    { type: 'ability', trigger: 'schooling', description: 'formTransformations.wishiwashi.schooling' },
  ],

  // Lycanroc - Time-based evolution
  'lycanroc': [
    { type: 'time', trigger: 'day', description: 'formTransformations.lycanroc.day' },
    { type: 'time', trigger: 'night', description: 'formTransformations.lycanroc.night' },
    { type: 'time', trigger: 'dusk', description: 'formTransformations.lycanroc.dusk' },
  ],

  // Zygarde - Cell-based transformations
  'zygarde': [
    { type: 'ability', trigger: 'aura-break', description: 'formTransformations.zygarde.auraBreak' },
    { type: 'item', trigger: 'zygarde-cube', description: 'formTransformations.zygarde.zygardeCube' },
  ],

  // Cherrim - Weather-based transformation
  'cherrim': [
    { type: 'weather', trigger: 'sunshine', description: 'formTransformations.cherrim.sunshine' },
    { type: 'weather', trigger: 'cloudy', description: 'formTransformations.cherrim.overcast' },
  ],

  // Burmy/Wormadam - Location-based cloak
  'burmy': [
    { type: 'location', trigger: 'grass', description: 'formTransformations.burmy.plantCloak' },
    { type: 'location', trigger: 'cave', description: 'formTransformations.burmy.sandyCloak' },
    { type: 'location', trigger: 'building', description: 'formTransformations.burmy.trashCloak' },
  ],

  // Aegislash - Stance change ability
  'aegislash': [
    { type: 'ability', trigger: 'stance-change', description: 'formTransformations.aegislash.stanceChange' },
  ],

  // Minior - Shell-based transformation
  'minior': [
    { type: 'ability', trigger: 'shields-down', description: 'formTransformations.minior.shieldsDown' },
  ],

  // Eiscue - Ice face ability
  'eiscue': [
    { type: 'ability', trigger: 'ice-face', description: 'formTransformations.eiscue.iceFace' },
  ],

  // Morpeko - Hunger switch ability
  'morpeko': [
    { type: 'ability', trigger: 'hunger-switch', description: 'formTransformations.morpeko.hungerSwitch' },
  ],

  // Toxtricity - Nature-based forms
  'toxtricity': [
    { type: 'nature', trigger: 'lonely', description: 'formTransformations.toxtricity.ampedForm' },
    { type: 'nature', trigger: 'gentle', description: 'formTransformations.toxtricity.lowKeyForm' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.toxtricity.gmax' },
  ],
  'toxtricity-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.toxtricity.gmaxToxtricity' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.toxtricity.gmaxBattle' },
  ],

  // Gender-based forms
  'indeedee': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.indeedee.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.indeedee.female' },
  ],

  'meowstic': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.meowstic.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.meowstic.female' },
  ],

  'pyroar': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.pyroar.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.pyroar.female' },
  ],

  'frillish': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.frillish.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.frillish.female' },
  ],

  'jellicent': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.jellicent.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.jellicent.female' },
  ],

  // Unown - Alphabet forms (28 forms)
  'unown': [
    { type: 'random', trigger: 'alphabet', description: 'formTransformations.unown.alphabet' },
  ],

  // Alcremie - Cream/ribbon forms (64+ combinations)
  'alcremie': [
    { type: 'item', trigger: 'strawberry-sweet', description: 'formTransformations.alcremie.strawberrySweet' },
    { type: 'item', trigger: 'love-sweet', description: 'formTransformations.alcremie.loveSweet' },
    { type: 'item', trigger: 'berry-sweet', description: 'formTransformations.alcremie.berrySweet' },
    { type: 'item', trigger: 'clover-sweet', description: 'formTransformations.alcremie.cloverSweet' },
    { type: 'item', trigger: 'flower-sweet', description: 'formTransformations.alcremie.flowerSweet' },
    { type: 'item', trigger: 'star-sweet', description: 'formTransformations.alcremie.starSweet' },
    { type: 'item', trigger: 'ribbon-sweet', description: 'formTransformations.alcremie.ribbonSweet' },
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.alcremie.gmax' },
  ],
  'alcremie-gmax': [
    { type: 'gmax', trigger: 'dynamax-band', description: 'formTransformations.alcremie.gmaxAlcremie' },
    { type: 'battle', trigger: 'gigantamax', description: 'formTransformations.alcremie.gmaxBattle' },
  ],

  // Vivillon - Pattern forms (20 patterns)
  'vivillon': [
    { type: 'location', trigger: 'geography', description: 'formTransformations.vivillon.geography' },
  ],

  // Basculin - Stripe forms
  'basculin': [
    { type: 'location', trigger: 'region', description: 'formTransformations.basculin.region' },
  ],

  // Deerling/Sawsbuck - Seasonal forms
  'deerling': [
    { type: 'time', trigger: 'spring', description: 'formTransformations.deerling.spring' },
    { type: 'time', trigger: 'summer', description: 'formTransformations.deerling.summer' },
    { type: 'time', trigger: 'autumn', description: 'formTransformations.deerling.autumn' },
    { type: 'time', trigger: 'winter', description: 'formTransformations.deerling.winter' },
  ],

  'sawsbuck': [
    { type: 'time', trigger: 'spring', description: 'formTransformations.sawsbuck.spring' },
    { type: 'time', trigger: 'summer', description: 'formTransformations.sawsbuck.summer' },
    { type: 'time', trigger: 'autumn', description: 'formTransformations.sawsbuck.autumn' },
    { type: 'time', trigger: 'winter', description: 'formTransformations.sawsbuck.winter' },
  ],

  // Pumpkaboo/Gourgeist - Size forms
  'pumpkaboo': [
    { type: 'size', trigger: 'small', description: 'formTransformations.pumpkaboo.small' },
    { type: 'size', trigger: 'average', description: 'formTransformations.pumpkaboo.average' },
    { type: 'size', trigger: 'large', description: 'formTransformations.pumpkaboo.large' },
    { type: 'size', trigger: 'super', description: 'formTransformations.pumpkaboo.super' },
  ],

  'gourgeist': [
    { type: 'size', trigger: 'small', description: 'formTransformations.gourgeist.small' },
    { type: 'size', trigger: 'average', description: 'formTransformations.gourgeist.average' },
    { type: 'size', trigger: 'large', description: 'formTransformations.gourgeist.large' },
    { type: 'size', trigger: 'super', description: 'formTransformations.gourgeist.super' },
  ],

  // More gender-based forms
  'oinkologne': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.oinkologne.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.oinkologne.female' },
  ],

  'basculegion': [
    { type: 'gender', trigger: 'male', description: 'formTransformations.basculegion.male' },
    { type: 'gender', trigger: 'female', description: 'formTransformations.basculegion.female' },
  ],

  // Family and evolution forms
  'maushold': [
    { type: 'evolution', trigger: 'family-of-three', description: 'formTransformations.maushold.familyOfThree' },
    { type: 'evolution', trigger: 'family-of-four', description: 'formTransformations.maushold.familyOfFour' },
  ],

  'dudunsparce': [
    { type: 'evolution', trigger: 'two-segment', description: 'formTransformations.dudunsparce.twoSegment' },
    { type: 'evolution', trigger: 'three-segment', description: 'formTransformations.dudunsparce.threeSegment' },
  ],

  'tatsugiri': [
    { type: 'evolution', trigger: 'curly', description: 'formTransformations.tatsugiri.curly' },
    { type: 'evolution', trigger: 'droopy', description: 'formTransformations.tatsugiri.droopy' },
    { type: 'evolution', trigger: 'stretchy', description: 'formTransformations.tatsugiri.stretchy' },
  ],

  // Squawkabilly - Plumage forms
  'squawkabilly': [
    { type: 'location', trigger: 'green-plumage', description: 'formTransformations.squawkabilly.greenPlumage' },
    { type: 'location', trigger: 'blue-plumage', description: 'formTransformations.squawkabilly.bluePlumage' },
    { type: 'location', trigger: 'yellow-plumage', description: 'formTransformations.squawkabilly.yellowPlumage' },
    { type: 'location', trigger: 'white-plumage', description: 'formTransformations.squawkabilly.whitePlumage' },
  ],

  // Palafin - Hero transformation
  'palafin': [
    { type: 'ability', trigger: 'zero-to-hero', description: 'formTransformations.palafin.zeroToHero' },
  ],

  // Legendary/Mythical transformations
  'tornadus': [
    { type: 'item', trigger: 'reveal-glass', description: 'formTransformations.legendary.revealGlass' },
  ],

  'thundurus': [
    { type: 'item', trigger: 'reveal-glass', description: 'formTransformations.legendary.revealGlass' },
  ],

  'landorus': [
    { type: 'item', trigger: 'reveal-glass', description: 'formTransformations.legendary.revealGlass' },
  ],

  'enamorus': [
    { type: 'item', trigger: 'reveal-glass', description: 'formTransformations.legendary.revealGlass' },
  ],

  'kyurem': [
    { type: 'item', trigger: 'dna-splicers', description: 'formTransformations.legendary.dnaSplicers' },
  ],

  'necrozma': [
    { type: 'item', trigger: 'n-solarizer', description: 'formTransformations.legendary.nSolarizer' },
    { type: 'item', trigger: 'n-lunarizer', description: 'formTransformations.legendary.nLunarizer' },
  ],
}
