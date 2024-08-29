export interface FishInfo {
  name: string;
  image: string;
  guide: string;
  link: string;
}

export const fishData: Record<string, FishInfo> = {
  'Largemouth Bass': {
    name: 'Largemouth Bass',
    image: '/fish/largemouth-bass.png',
    guide:
      'Use a medium to heavy spinning rod with lures like crankbaits or soft plastics. Bass are often found near cover such as logs, rocks, or vegetation.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/lmb',
  },
  'Channel Catfish': {
    name: 'Channel Catfish',
    image: '/fish/channel-catfish.png',
    guide:
      'Fishing for channel catfish is best done at night. Use bait such as worms, cut bait, or stink bait on a sturdy bottom rig.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/ccf/?pk_vid=d1829b1657a1de4317343081774f1dfa',
  },
  'Crappie': {
    name: 'Crappie',
    image: '/fish/crappie.png',
    guide:
      'Use small jigs or live minnows. Crappie prefer areas with submerged structures like brush piles or fallen trees.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/wcp/',
  },
  'Redear Sunfish': {
    name: 'Redear Sunfish',
    image: '/fish/redear-sunfish.png',
    guide:
      'Use small live or artificial baits such as worms or small insects. They are often found in shallow waters with vegetation.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/sunfish/',
  },
  'Longear Sunfish': {
    name: 'Longear Sunfish',
    image: '/fish/longear-sunfish.png',
    guide:
      'Use small live baits or tiny soft plastics. They prefer clear waters with abundant aquatic vegetation.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/longearsunfish/',
  },
  'White Bass': {
    name: 'White Bass',
    image: '/fish/white-bass.png',
    guide:
      'Use small spinnerbaits, crankbaits, or live shiners. White bass often school near submerged structures and drop-offs.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/wtb/',
  },
  'Striped Bass': {
    name: 'Striped Bass',
    image: '/fish/striped-bass.png',
    guide:
      'Use larger lures such as spoons, jigs, or live bait like eels. Striped bass are typically found in deeper waters near structures.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/str/',
  },
  'Smallmouth Bass': {
    name: 'Smallmouth Bass',
    image: '/fish/smallmouth-bass.png',
    guide:
      'Use light to medium spinning rods with lures like jigs, crankbaits, or spinnerbaits. Smallmouth bass are often found near rocky areas or submerged structures.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/smb/',
  },
  'Spotted Bass': {
    name: 'Spotted Bass',
    image: '/fish/spotted-bass.png',
    guide:
      'Use light spinning rods with small crankbaits, jigs, or soft plastics. Spotted bass are often found near rocky points, submerged brush, or deep drop-offs.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/spb/',
  },
  'Blue Catfish': {
    name: 'Blue Catfish',
    image: '/fish/blue-catfish.png',
    guide:
      'Use sturdy rods with heavy line and baits such as fresh shad, cut bait, or live bait. Blue catfish are often found in deep river channels, near ledges, or below dams.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/blc/',
  },
  'Flathead Catfish': {
    name: 'Flathead Catfish',
    image: '/fish/flathead-catfish.png',
    guide:
      'Use heavy tackle with live bait such as small sunfish or shad. Flathead catfish prefer slow-moving waters and are commonly found near logs, rocks, or submerged structures.',
    link: 'https://tpwd.texas.gov/huntwild/wild/species/catfish/',
  },
};
