// ---- Theo's dinosaurs: the reward. Eggs from solved puzzles hatch into the same dinosaurs that live in Dino World ----
// (the pictures in art/dinos/ are rendered from the Dino Ten game's own models, in the order they hatch there).
'use strict';
PS.DINOS = [
  ['Triceratops', 'Triceratops', 'Triceratops had three horns. It ate plants.'],
  ['Parasaurolophus', 'Parasaurolophus', 'It had a long crest on its head. It ate plants.'],
  ['Stegosaurus', 'Stegosaurus', 'It had big plates on its back and spikes on its tail.'],
  ['Apatosaurus', 'Apatosaurus', 'It had a very long neck. It ate leaves from tall trees.'],
  ['Velociraptor', 'Velociraptor', 'It was fast and had feathers. It was as big as a turkey.'],
  ['Trex', 'T. rex', 'T. rex had big teeth. It ate meat.'],
  ['Ankylosaurus', 'Ankylosaurus', 'It had armour like a tank and a big club on its tail.'],
  ['Brachiosaurus', 'Brachiosaurus', 'It was as tall as a house! Its front legs were longer than its back legs.'],
  ['Spinosaurus', 'Spinosaurus', 'It had a big sail on its back. It caught fish in rivers.'],
  ['Pachycephalosaurus', 'Pachycephalosaurus', 'It had a hard, round head. It bumped heads with other dinos.'],
  ['Diplodocus', 'Diplodocus', 'It had a long neck and a very, very long tail, like a whip.'],
  ['Dilophosaurus', 'Dilophosaurus', 'It had two thin crests on its head. It was quick and ate meat.'],
  ['Iguanodon', 'Iguanodon', 'It had a spike on each thumb. It ate plants.'],
  ['Styracosaurus', 'Styracosaurus', 'It had a big horn on its nose and spikes all round its frill.'],
  ['Allosaurus', 'Allosaurus', 'It had little horns over its eyes. It was a big hunter.'],
  ['Gallimimus', 'Gallimimus', 'It ran very fast, like an ostrich. It had a beak.'],
  ['Corythosaurus', 'Corythosaurus', 'It had a crest like a helmet. It could honk loudly.'],
  ['Kentrosaurus', 'Kentrosaurus', 'It had spikes on its back and on its tail. Ouch!'],
  ['Carnotaurus', 'Carnotaurus', 'It had horns like a bull and very tiny arms.'],
  ['Protoceratops', 'Protoceratops', 'It was as big as a sheep. It had a frill and a beak.'],
  ['Baryonyx', 'Baryonyx', 'It had a long snout like a crocodile and a big claw. It ate fish.'],
  ['Therizinosaurus', 'Therizinosaurus', 'It had giant claws, longer than your arm! But it ate plants.'],
  ['Compsognathus', 'Compsognathus', 'It was tiny, as small as a chicken! It ate bugs and lizards.'],
  ['Giganotosaurus', 'Giganotosaurus', 'It was even longer than T. rex! It was one of the biggest hunters.'],
].map(([id, name, fact]) => ({ id, name, fact, img: `art/dinos/${id}.png` }));
PS.EGGS_PER_DINO = 3;
PS.dinoKey = () => 'ps_dinos_' + PS.player;
PS.dinosHatched = () => PS.load(PS.dinoKey(), []);
PS.eggTotal = () => PS.load('ps_stars_' + PS.player, 0);
// Hatch one dinosaur if enough eggs have been earned. Returns it, or null.
PS.hatchIfDue = () => {
  const have = PS.dinosHatched(), due = Math.min(PS.DINOS.length, Math.floor(PS.eggTotal() / PS.EGGS_PER_DINO));
  if (have.length >= due) return null;
  const d = PS.DINOS[have.length]; have.push(d.id); PS.save(PS.dinoKey(), have);
  return d;
};
