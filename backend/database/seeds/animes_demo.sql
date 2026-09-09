-- Seed de animes demo para uso enquanto a AniList API não estiver disponível

INSERT INTO anime (external_id, slug, title, title_english, title_romaji, description, cover_url, banner_url, year, season, status, type, episodes_count, duration, studio, score, popularity) VALUES
(20,    'naruto',                'Naruto',                          'Naruto',                        'Naruto',                    'Naruto Uzumaki, um jovem ninja que busca reconhecimento de seus pares e sonha em se tornar o Hokage, o líder de sua vila.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreicbompibcnkpuizoq37e4iyikejlsriqnm5zrpnwvl3ibr5wvmwka.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/20-3eTfKGRZz8gg.jpg',
 2002, 'FALL',   'FINISHED',  'TV',   220, 23, 'Pierrot',          8.3, 250000),

(21,    'one-piece',             'One Piece',                       'One Piece',                     'One Piece',                 'Monkey D. Luffy, um jovem que acidentalmente comeu uma Akuma no Mi, parte em busca do tesouro supremo One Piece para se tornar o Rei dos Piratas.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3LMjJA5s.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg',
 1999, 'FALL',   'RELEASING', 'TV',  1100, 24, 'Toei Animation',   9.0, 400000),

(11061, 'hunter-x-hunter-2011', 'Hunter x Hunter (2011)',           'Hunter x Hunter (2011)',        'Hunter x Hunter (2011)',    'Gon Freecss decide seguir os passos de seu pai e se tornar um Hunter de elite, encontrando amigos e inimigos ao longo do caminho.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreidwyxm7cq3bkgnq4kxkd4csz7l2r7qdmxejp6jycvfkx22pwjxjy.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11061-YEpPSFUOaYnS.jpg',
 2011, 'FALL',   'FINISHED',  'TV',   148, 23, 'Madhouse',         9.0, 300000),

(16498, 'shingeki-no-kyojin',   'Shingeki no Kyojin',              'Attack on Titan',               'Shingeki no Kyojin',        'Após séculos sendo devorada por Titãs, a humanidade se refugia atrás de enormes muralhas. Eren Yeager jura se vingar quando um Titã colossal destrói sua cidade natal.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreidmhqwwzrkf7p73msxaflbzfxurhmg3m3m4k3g5oxvkx5fhj7ytom.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498-8jpFCOcDmneX.jpg',
 2013, 'SPRING', 'FINISHED',  'TV',    25, 24, 'WIT Studio',       9.0, 500000),

(101922,'kimetsu-no-yaiba',     'Kimetsu no Yaiba',                'Demon Slayer',                  'Kimetsu no Yaiba',          'Tanjiro Kamado torna-se um Matador de Demônios após sua família ser massacrada e sua irmã transformada em demônio.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreifs7y7kbzqq4b5i7bzawkh4cz6xfqjewq3tlbq6kckpflp2rbkm3y.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-HwgZMFbkNSAF.jpg',
 2019, 'SPRING', 'FINISHED',  'TV',    26, 23, 'ufotable',         8.7, 450000),

(113415,'jujutsu-kaisen',       'Jujutsu Kaisen',                  'Jujutsu Kaisen',                'Jujutsu Kaisen',            'Yuji Itadori engole um dedo maldito para proteger seus amigos e acaba se tornando hospedeiro do maior de todos os Espíritos Malditos.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreib2ufuqm35hprtbagzmgocjqxwi4iapvxqalh4cqm7wvxxbagqoq4.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-9YRWuUcGfFBl.jpg',
 2020, 'FALL',   'RELEASING', 'TV',    24, 23, 'MAPPA',            8.8, 480000),

(9253,  'steins-gate',          'Steins;Gate',                     'Steins;Gate',                   'Steins;Gate',               'Rintaro Okabe e seus amigos descobrem acidentalmente como enviar mensagens para o passado, desencadeando uma série de eventos que ameaçam o futuro.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreiezbjxon6yrcbm44a4jjnqxqiflhbcgkszdmixe5jnzocnqqurvvq.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/9253-G5gM2CRmGdBl.jpg',
 2011, 'SPRING', 'FINISHED',  'TV',    24, 24, 'White Fox',        9.1, 280000),

(1535,  'death-note',           'Death Note',                      'Death Note',                    'Death Note',                'Light Yagami encontra um caderno sobrenatural que mata qualquer pessoa cujo nome seja escrito nele, e decide usá-lo para criar um mundo livre do crime.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreibu36yc46yxjkbkbw3hb3f2zr7yxgqnrm3twlpaxn5g5aqpw3i64.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535-HGJrlUbm84sC.jpg',
 2006, 'FALL',   'FINISHED',  'TV',    37, 23, 'Madhouse',         8.6, 350000),

(10620, 'mirai-nikki',          'Mirai Nikki',                     'Future Diary',                  'Mirai Nikki',               'Yukiteru recebe um diário profético do futuro e é forçado a participar de um jogo de sobrevivência contra outros 11 donos de diários do futuro.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreih42wdj5bqh6ppqxdmdv3iqhvn3r5mkfmz3pbajlb6mowq4dtjxcy.jpg',
 null,
 2011, 'FALL',   'FINISHED',  'TV',    26, 23, 'asread',           7.5, 180000),

(113415+1,'fullmetal-alchemist-brotherhood','Fullmetal Alchemist: Brotherhood','Fullmetal Alchemist: Brotherhood','Fullmetal Alchemist: Brotherhood',
 'Os irmãos Elric buscam a Pedra Filosofal para recuperar seus corpos após uma tentativa fracassada de trazer sua mãe de volta à vida usando alquimia proibida.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreiccqs3ypmq6xzifpqxktxbqfqhekn2mfhgkiaq3ldibm5ydovlkbu.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-qTJBJk1bGnAE.jpg',
 2009, 'SPRING', 'FINISHED',  'TV',    64, 24, 'Bones',            9.1, 380000),

(99426, 'sword-art-online',     'Sword Art Online',                'Sword Art Online',              'Sword Art Online',          'Dez mil jogadores ficam presos em um jogo de RPG de realidade virtual onde morrer no jogo significa morrer na vida real.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreibqexyxgb4mawvusnxvjsgjnhbmhyebxqojb7faqwnrmdv2qv6mua.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11757-I2oheKRovDaS.jpg',
 2012, 'SUMMER', 'FINISHED',  'TV',    25, 23, 'A-1 Pictures',     7.2, 320000),

(269,   'bleach',               'Bleach',                          'Bleach',                        'Bleach',                    'Ichigo Kurosaki, um adolescente com capacidade de ver fantasmas, ganha os poderes de um Shinigami e assume a responsabilidade de proteger as almas.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreidmhqwwzrkf7p73msxaflbzfxurhmg3m3m4k3g5oxvkx5fhj7ytom.jpg',
 null,
 2004, 'FALL',   'FINISHED',  'TV',   366, 23, 'Pierrot',          7.9, 280000),

(31964, 'boku-no-hero-academia','Boku no Hero Academia',           'My Hero Academia',              'Boku no Hero Academia',     'Em um mundo onde a maioria das pessoas possui superpoderes chamados Quirks, Izuku Midoriya nasce sem nenhum, mas mesmo assim sonha em se tornar um herói.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreihfpfqe7hqywjgfpnqqlhk5ydqtqmxrqxmzjdnfxpcrpjefxoyge.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/31964-etzdSBt2tZEE.jpg',
 2016, 'SPRING', 'RELEASING', 'TV',   138, 24, 'Bones',            7.9, 350000),

(98478, 'tokyo-ghoul',          'Tokyo Ghoul',                     'Tokyo Ghoul',                   'Tokyo Ghoul',               'Ken Kaneki sobrevive a um encontro com uma Ghoul e se torna um híbrido humano-Ghoul, forçado a navegar em dois mundos.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreifn3vn7a6hdxjcr2ozuvsq2hqqz7vb5l2mbqirgpbhg7g5ypifuqy.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11429-hVXrOFsFCQCP.jpg',
 2014, 'SUMMER', 'FINISHED',  'TV',    12, 24, 'Studio Pierrot',   7.8, 290000),

(97986, 're-zero',              'Re:Zero kara Hajimeru Isekai Seikatsu', 'Re:ZERO -Starting Life in Another World-', 'Re:Zero kara Hajimeru Isekai Seikatsu',
 'Subaru Natsuki é transportado para outro mundo e descobre que possui o poder de voltar no tempo ao morrer.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreicjlvjwsyyyttkrxb63hf7o7xcnefvhefxdqkiwcpojpiqbkaqtqm.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-wFGOvsCZOSY5.jpg',
 2016, 'SPRING', 'FINISHED',  'TV',    25, 23, 'White Fox',        8.3, 310000),

(918,   'gintama',              'Gintama',                         'Gintama',                       'Gintama',                   'No Japão do período Edo invadido por alienígenas, Gintoki Sakata trabalha como prestador de serviços para pagar o aluguel.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreihgtaxvyxpkbq5nmf5v7y72mluasqukrucjvkpmzxz4dn2gv5j37m.jpg',
 null,
 2006, 'SPRING', 'FINISHED',  'TV',   201, 24, 'Sunrise',          9.0, 200000),

(130010,'chainsaw-man',         'Chainsaw Man',                    'Chainsaw Man',                  'Chainsaw Man',              'Denji, um jovem miserável que trabalha matando demônios para pagar as dívidas de seu pai morto, funde-se com seu demônio-cachorro e se torna o Homem-Motosserra.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreih4mfwvzkm5fxyyxfb5gzj7qm7pbhnvx2rk2igp3gfm6z7ybkmmle.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/130010-TuS3vAZ5Mv7e.jpg',
 2022, 'FALL',   'FINISHED',  'TV',    12, 24, 'MAPPA',            8.3, 380000),

(150672,'solo-leveling',        'Solo Leveling',                   'Solo Leveling',                 'Ore dake Level Up na Ken',  'Sung Jinwoo era o caçador mais fraco do mundo até ser dado como morto e acordar com um sistema único que lhe permite evoluir sem limites.',
 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bafkreievpfozfyxn3pcfpnm4rbhh6sbbh5a2dqofq64jkyxf7h2a5mubga.jpg',
 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/166240-BtBjC3RWjqMP.jpg',
 2024, 'WINTER', 'FINISHED',  'TV',    12, 24, 'A-1 Pictures',     8.8, 500000)

ON CONFLICT (external_id) DO NOTHING;

-- Gêneros para os animes inseridos
WITH anime_data AS (
  SELECT id, slug FROM anime WHERE slug IN (
    'naruto','one-piece','hunter-x-hunter-2011','shingeki-no-kyojin',
    'kimetsu-no-yaiba','jujutsu-kaisen','steins-gate','death-note',
    'fullmetal-alchemist-brotherhood','sword-art-online','bleach',
    'boku-no-hero-academia','tokyo-ghoul','re-zero','gintama',
    'chainsaw-man','solo-leveling','mirai-nikki'
  )
),
genre_data AS (
  SELECT id, slug FROM genres
)
INSERT INTO anime_genres (anime_id, genre_id)
SELECT a.id, g.id FROM anime_data a, genre_data g
WHERE
  (a.slug IN ('naruto','bleach','boku-no-hero-academia','kimetsu-no-yaiba','jujutsu-kaisen','chainsaw-man','solo-leveling') AND g.slug = 'acao')
  OR (a.slug IN ('naruto','one-piece','hunter-x-hunter-2011') AND g.slug = 'aventura')
  OR (a.slug IN ('naruto','one-piece','bleach','boku-no-hero-academia','kimetsu-no-yaiba','jujutsu-kaisen','solo-leveling','chainsaw-man') AND g.slug = 'shounen')
  OR (a.slug IN ('shingeki-no-kyojin','tokyo-ghoul','mirai-nikki') AND g.slug = 'drama')
  OR (a.slug IN ('steins-gate','death-note') AND g.slug = 'psicologico')
  OR (a.slug IN ('death-note','steins-gate','mirai-nikki') AND g.slug = 'misterio')
  OR (a.slug IN ('fullmetal-alchemist-brotherhood','one-piece','naruto','boku-no-hero-academia') AND g.slug = 'fantasia')
  OR (a.slug IN ('sword-art-online','re-zero') AND g.slug = 'isekai')
  OR (a.slug IN ('re-zero','sword-art-online','solo-leveling') AND g.slug = 'fantasia')
  OR (a.slug IN ('gintama') AND g.slug = 'comedia')
  OR (a.slug IN ('shingeki-no-kyojin','fullmetal-alchemist-brotherhood') AND g.slug = 'acao')
  OR (a.slug IN ('tokyo-ghoul','chainsaw-man') AND g.slug = 'sobrenatural')
ON CONFLICT DO NOTHING;

-- Cria temporada 1 para todos os animes
INSERT INTO seasons (anime_id, number, title, year, episodes_count)
SELECT id, 1, 'Temporada 1', year, episodes_count FROM anime
WHERE slug IN (
  'naruto','one-piece','hunter-x-hunter-2011','shingeki-no-kyojin',
  'kimetsu-no-yaiba','jujutsu-kaisen','steins-gate','death-note',
  'fullmetal-alchemist-brotherhood','sword-art-online','bleach',
  'boku-no-hero-academia','tokyo-ghoul','re-zero','gintama',
  'chainsaw-man','solo-leveling','mirai-nikki'
)
ON CONFLICT (anime_id, number) DO NOTHING;

SELECT COUNT(*) AS total_animes FROM anime;
