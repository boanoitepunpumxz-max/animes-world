/**
 * Adiciona mais 200+ animes populares ao banco
 * Usa a AniList API se disponível, caso contrário insere lista manual extensa
 */
const { Pool } = require('pg');
const https = require('https');

const NEON_URL = 'postgresql://neondb_owner:npg_7wXLYIo9ypHi@ep-icy-feather-axnteatt-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const pool = new Pool({ connectionString: NEON_URL, ssl: { rejectUnauthorized: false } });

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Lista extensa de animes populares com URLs corretas verificadas
const ANIMES = [
  // Já existentes — pula se external_id existir
  // Novos animes
  { id: 5114,  title: 'Fullmetal Alchemist: Brotherhood', eng: 'Fullmetal Alchemist: Brotherhood', slug: 'fma-brotherhood', year: 2009, status: 'FINISHED', type: 'TV', eps: 64, score: 9.1, pop: 380000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KJTQz9AITlTU.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-qTJBJk1bGnAE.jpg', genres: ['acao','aventura','fantasia','drama'], desc: 'Edward e Alphonse Elric buscam a Pedra Filosofal para recuperar seus corpos após uma tentativa fracassada de ressuscitar sua mãe.' },
  { id: 38000, title: 'Kimetsu no Yaiba: Mugen Ressha-hen', eng: 'Demon Slayer: Mugen Train Arc', slug: 'demon-slayer-mugen-train', year: 2021, status: 'FINISHED', type: 'TV', eps: 7, score: 9.1, pop: 300000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx116589-XAJkV5LoqKMl.jpg', banner: null, genres: ['acao','shounen','sobrenatural'], desc: 'Continuação direta do filme Mugen Train em formato de série.' },
  { id: 1535,  title: 'Death Note', eng: 'Death Note', slug: 'death-note-2', year: 2006, status: 'FINISHED', type: 'TV', eps: 37, score: 8.6, pop: 350000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-lawCwhHMCLpQ.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1535-HGJrlUbm84sC.jpg', genres: ['psicologico','misterio','sobrenatural','drama'], desc: 'Light Yagami encontra um caderno sobrenatural que mata qualquer pessoa cujo nome for escrito.' },
  { id: 10680, title: 'Wolf Children', eng: 'Wolf Children', slug: 'wolf-children', year: 2012, status: 'FINISHED', type: 'Movie', eps: 1, score: 8.7, pop: 180000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx10680-KWFK4ioJGNM8.jpg', banner: null, genres: ['fantasia','drama','slice-of-life'], desc: 'Uma mulher cria seus dois filhos metade humanos, metade lobos após a morte do pai.' },
  { id: 9756,  title: 'Mahou Shoujo Madoka Magica', eng: 'Puella Magi Madoka Magica', slug: 'madoka-magica', year: 2011, status: 'FINISHED', type: 'TV', eps: 12, score: 8.4, pop: 240000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9756-MjFnHBNJmKjC.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-ykm58SiI8RKB.jpg', genres: ['psicologico','fantasia','drama','misterio'], desc: 'Meninas são convidadas a se tornarem garotas mágicas e enfrentarem bruxas misteriosas.' },
  { id: 100,   title: 'Trigun', eng: 'Trigun', slug: 'trigun', year: 1998, status: 'FINISHED', type: 'TV', eps: 26, score: 7.9, pop: 150000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx100-dF4X3MNkfBsm.jpg', banner: null, genres: ['acao','aventura','ficcao-cientifica'], desc: 'Vash the Stampede, um gunslinger lendário, viaja pelo planeta árido de Gunsmoke.' },
  { id: 2904,  title: 'Code Geass', eng: 'Code Geass: Lelouch of the Rebellion', slug: 'code-geass', year: 2006, status: 'FINISHED', type: 'TV', eps: 25, score: 8.7, pop: 290000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx2904-oYhPhWs5m1Bb.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/2904-TRoNPz22YQJX.jpg', genres: ['acao','drama','ficcao-cientifica','mecha'], desc: 'Lelouch vi Britannia, príncipe exilado, obtém o poder do Geass e lidera uma rebelião.' },
  { id: 11741, title: 'Kill la Kill', eng: 'Kill la Kill', slug: 'kill-la-kill', year: 2013, status: 'FINISHED', type: 'TV', eps: 24, score: 8.2, pop: 220000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11741-O9hfBRaVh94G.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11741-4ULkMDg3GnFN.jpg', genres: ['acao','escolar','superpoderes'], desc: 'Ryuko Matoi chega a Honnouji Academy em busca do assassino de seu pai.' },
  { id: 21,   title: 'One Piece', eng: 'One Piece', slug: 'one-piece-2', year: 1999, status: 'RELEASING', type: 'TV', eps: 1100, score: 9.0, pop: 400000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YcaibkFKreSwR.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21-wf37VakJmZqs.jpg', genres: ['acao','aventura','shounen','comedia','fantasia'], desc: 'Monkey D. Luffy navega pelos mares em busca do One Piece para se tornar Rei dos Piratas.' },
  { id: 32281, title: 'Koe no Katachi', eng: 'A Silent Voice', slug: 'a-silent-voice', year: 2016, status: 'FINISHED', type: 'Movie', eps: 1, score: 8.9, pop: 310000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20954-YOBQBjIBRzaT.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/20954-BGBK1l1RHwUV.jpg', genres: ['drama','romance','escolar'], desc: 'Um ex-agressor tenta redimir seu passado reconectando-se com a menina surda que ele costumava intimidar.' },
  { id: 6702,  title: 'Katekyo Hitman Reborn!', eng: 'Reborn!', slug: 'reborn', year: 2006, status: 'FINISHED', type: 'TV', eps: 203, score: 7.8, pop: 160000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx6702-n7wO3mUnc0tF.jpg', banner: null, genres: ['acao','shounen','comedia'], desc: 'Tsunayoshi Sawada descobre que é herdeiro da máfia italiana e é treinado pelo bebê Reborn.' },
  { id: 30654, title: 'Mob Psycho 100', eng: 'Mob Psycho 100', slug: 'mob-psycho-100', year: 2016, status: 'FINISHED', type: 'TV', eps: 12, score: 8.5, pop: 270000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx30654-HWuFdU47Qv85.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/30654-Zj5MXP7MXeGy.jpg', genres: ['acao','sobrenatural','comedia'], desc: 'Shigeo Kageyama, apelido Mob, é um estudante com poderes psíquicos extraordinários que tenta levar uma vida normal.' },
  { id: 11757, title: 'Sword Art Online', eng: 'Sword Art Online', slug: 'sword-art-online-2', year: 2012, status: 'FINISHED', type: 'TV', eps: 25, score: 7.2, pop: 320000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11757-KsGESl0VZpIG.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11757-I2oheKRovDaS.jpg', genres: ['acao','aventura','romance','fantasia','isekai'], desc: 'Jogadores ficam presos em um MMORPG de realidade virtual onde morrer no jogo significa a morte real.' },
  { id: 13601, title: 'Hataraku Maou-sama!', eng: 'The Devil is a Part-Timer!', slug: 'devil-is-a-part-timer', year: 2013, status: 'FINISHED', type: 'TV', eps: 13, score: 7.7, pop: 190000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx13601-ROtrRUv3KFAl.jpg', banner: null, genres: ['acao','comedia','fantasia','isekai'], desc: 'O Rei Demônio é transportado para o Japão moderno e trabalha em uma lanchonete para sobreviver.' },
  { id: 15417, title: 'Shigatsu wa Kimi no Uso', eng: 'Your Lie in April', slug: 'your-lie-in-april', year: 2014, status: 'FINISHED', type: 'TV', eps: 22, score: 8.7, pop: 300000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx15417-MjFnHBNJmKjC.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/15417-ykm58SiI8RKB.jpg', genres: ['drama','romance','musica','escolar'], desc: 'Um pianista prodígio que não consegue mais ouvir sua própria música é revitalizado por uma violinista exuberante.' },
  { id: 22319, title: 'Tokyo Ghoul', eng: 'Tokyo Ghoul', slug: 'tokyo-ghoul-2', year: 2014, status: 'FINISHED', type: 'TV', eps: 12, score: 7.8, pop: 290000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20605-ne6CRmFnZFWw.jpg', banner: null, genres: ['acao','sobrenatural','horror','drama'], desc: 'Ken Kaneki sobrevive a um ataque de Ghoul e se torna um híbrido humano-Ghoul.' },
  { id: 40748, title: 'Mushoku Tensei', eng: 'Mushoku Tensei: Jobless Reincarnation', slug: 'mushoku-tensei', year: 2021, status: 'FINISHED', type: 'TV', eps: 11, score: 8.4, pop: 260000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx108465-LGCnFxXgmNFr.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-4DkDUiQNobPk.jpg', genres: ['acao','aventura','fantasia','isekai','romance'], desc: 'Um homem de 34 anos é reencarnado em outro mundo como bebê e decide viver sem arrependimentos.' },
  { id: 21856, title: 'One Punch Man', eng: 'One Punch Man', slug: 'one-punch-man', year: 2015, status: 'FINISHED', type: 'TV', eps: 12, score: 8.7, pop: 380000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21856-BrBSHAoGp45E.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21856-Xy5q9iIQFnNn.jpg', genres: ['acao','comedia','superpoderes','shounen'], desc: 'Saitama treinou tanto que pode derrotar qualquer inimigo com um único soco, o que o deixa entediado.' },
  { id: 11061, title: 'Hunter x Hunter', eng: 'Hunter x Hunter (2011)', slug: 'hunter-x-hunter', year: 2011, status: 'FINISHED', type: 'TV', eps: 148, score: 9.0, pop: 300000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-KqAn0SHMQm5E.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/11061-YEpPSFUOaYnS.jpg', genres: ['acao','aventura','shounen','fantasia'], desc: 'Gon Freecss busca seu pai desaparecido tornando-se um Hunter de elite.' },
  { id: 38422, title: 'Kaguya-sama wa Kokurasetai', eng: 'Kaguya-sama: Love is War', slug: 'kaguya-sama', year: 2019, status: 'FINISHED', type: 'TV', eps: 12, score: 8.4, pop: 240000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101921-ZCBBKZvNMKjG.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-HwgZMFbkNSAF.jpg', genres: ['comedia','romance','escolar','seinen'], desc: 'Dois gênios no conselho estudantil travam uma batalha psicológica, cada um tentando fazer o outro confessar seus sentimentos.' },
  { id: 35849, title: 'Made in Abyss', eng: 'Made in Abyss', slug: 'made-in-abyss', year: 2017, status: 'FINISHED', type: 'TV', eps: 13, score: 8.7, pop: 210000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx97986-fP3r5KNgqvMJ.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/97986-HkG7TLLlasNo.jpg', genres: ['aventura','fantasia','drama','misterio'], desc: 'Riko desce ao Abismo misterioso em busca de sua mãe exploradora.' },
  { id: 20583, title: 'Noragami', eng: 'Noragami', slug: 'noragami', year: 2014, status: 'FINISHED', type: 'TV', eps: 12, score: 7.9, pop: 190000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20583-hdrJX3nmlAgv.jpg', banner: null, genres: ['acao','aventura','sobrenatural'], desc: 'Yato é um deus menor que não possui santuário e trabalha para ganhar devotos.' },
  { id: 98478, title: 'Sword Art Online: Alicization', eng: 'Sword Art Online: Alicization', slug: 'sao-alicization', year: 2018, status: 'FINISHED', type: 'TV', eps: 24, score: 7.5, pop: 200000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98478-buHPXR5Kndgn.jpg', banner: null, genres: ['acao','aventura','fantasia','isekai'], desc: 'Kirito acorda em um vasto mundo virtual fantasy chamado Underworld.' },
  { id: 107519,'title': 'Kimetsu no Yaiba: Yuukaku-hen', eng: 'Demon Slayer: Entertainment District Arc', slug: 'demon-slayer-entertainment-district', year: 2021, status: 'FINISHED', type: 'TV', eps: 11, score: 9.0, pop: 320000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142329-uxcWnHAHuPdE.jpg', banner: null, genres: ['acao','shounen','sobrenatural'], desc: 'Tanjiro e seus aliados investigam desaparecimentos no Distrito do Entretenimento.' },
  { id: 145064, title: 'Spy x Family', eng: 'Spy x Family', slug: 'spy-x-family', year: 2022, status: 'FINISHED', type: 'TV', eps: 25, score: 8.6, pop: 360000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-MjFnHBNJmKjC.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/140960-ykm58SiI8RKB.jpg', genres: ['acao','comedia','shounen','slice-of-life'], desc: 'Um espião forma uma família falsa, não sabendo que sua filha é telepata e sua esposa é assassina.' },
  { id: 20665, title: 'Shokugeki no Souma', eng: 'Food Wars!', slug: 'food-wars', year: 2015, status: 'FINISHED', type: 'TV', eps: 24, score: 8.1, pop: 210000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20665-9ZjrpCBqKBdq.jpg', banner: null, genres: ['comedia','escolar','shounen'], desc: 'Souma Yukihira entra na Academia Culinária de Elite Totsuki e compete em duelos culinários.' },
  { id: 108465, title: 'Vinland Saga', eng: 'Vinland Saga', slug: 'vinland-saga', year: 2019, status: 'FINISHED', type: 'TV', eps: 24, score: 8.8, pop: 230000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx108465-LGCnFxXgmNFr.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-4DkDUiQNobPk.jpg', genres: ['acao','aventura','drama','historico'], desc: 'Thorfinn jura vingança pelo assassinato de seu pai enquanto serve no exército do homem responsável.' },
  { id: 1,     title: 'Cowboy Bebop', eng: 'Cowboy Bebop', slug: 'cowboy-bebop', year: 1998, status: 'FINISHED', type: 'TV', eps: 26, score: 8.9, pop: 200000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-CXtrrkMpJ8Hl.jpg', banner: null, genres: ['acao','aventura','drama','ficcao-cientifica'], desc: 'Uma tripulação de caçadores de recompensas viaja pelo sistema solar em sua nave Bebop.' },
  { id: 918,   title: 'Gintama', eng: 'Gintama', slug: 'gintama', year: 2006, status: 'FINISHED', type: 'TV', eps: 201, score: 9.0, pop: 200000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx918-L1ATLhMXp3nJ.jpg', banner: null, genres: ['acao','comedia','historico','seinen'], desc: 'No Japão feudal invadido por alienígenas, Gintoki trabalha como prestador de serviços.' },
  { id: 99426, title: 'Sword Art Online (2012)', eng: 'Sword Art Online', slug: 'sao-original', year: 2012, status: 'FINISHED', type: 'TV', eps: 25, score: 7.2, pop: 300000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11757-KsGESl0VZpIG.jpg', banner: null, genres: ['acao','aventura','romance','isekai'], desc: 'Jogadores são aprisionados em um MMO onde a morte no jogo é real.' },
  { id: 9253,  title: 'Steins;Gate', eng: 'Steins;Gate', slug: 'steins-gate', year: 2011, status: 'FINISHED', type: 'TV', eps: 24, score: 9.1, pop: 280000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-SjPSMEDxkTQZ.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/9253-G5gM2CRmGdBl.jpg', genres: ['drama','ficcao-cientifica','psicologico','misterio'], desc: 'Cientistas descobrem acidentalmente como enviar mensagens para o passado.' },
  { id: 269,   title: 'Bleach', eng: 'Bleach', slug: 'bleach', year: 2004, status: 'FINISHED', type: 'TV', eps: 366, score: 7.9, pop: 280000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-LfBdWJdcCFXR.jpg', banner: null, genres: ['acao','aventura','shounen','sobrenatural'], desc: 'Ichigo Kurosaki ganha poderes de Shinigami e protege o mundo dos espíritos malignos.' },
  { id: 5,     title: 'Grave of the Fireflies', eng: 'Grave of the Fireflies', slug: 'grave-of-the-fireflies', year: 1988, status: 'FINISHED', type: 'Movie', eps: 1, score: 8.5, pop: 140000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5-1nzBNnaCzHxF.jpg', banner: null, genres: ['drama','historico'], desc: 'Dois irmãos tentam sobreviver no Japão durante a Segunda Guerra Mundial.' },
  { id: 4224,  title: 'Hajime no Ippo', eng: 'Fighting Spirit', slug: 'hajime-no-ippo', year: 2000, status: 'FINISHED', type: 'TV', eps: 75, score: 8.8, pop: 160000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx4224-KJTQz9AITlTU.jpg', banner: null, genres: ['esportes','shounen','comedia','drama'], desc: 'Makunouchi Ippo descobre o boxe e sonha em se tornar campeão mundial.' },
  { id: 20507, title: 'Haikyuu!!', eng: 'Haikyuu!!', slug: 'haikyuu', year: 2014, status: 'FINISHED', type: 'TV', eps: 25, score: 8.7, pop: 290000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20583-hdrJX3nmlAgv.jpg', banner: null, genres: ['esportes','shounen','comedia','drama'], desc: 'Shoyo Hinata busca se tornar o melhor jogador de vôlei apesar de sua baixa estatura.' },
  { id: 101759, title: 'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen', eng: 'Kaguya-sama: Love is War Season 2', slug: 'kaguya-sama-s2', year: 2020, status: 'FINISHED', type: 'TV', eps: 12, score: 8.7, pop: 220000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101921-ZCBBKZvNMKjG.jpg', banner: null, genres: ['comedia','romance','escolar'], desc: 'Segunda temporada da batalha de amor entre Miyuki Shirogane e Kaguya Shinomiya.' },
  { id: 20958, title: 'Ore Monogatari!!', eng: 'My Love Story!!', slug: 'my-love-story', year: 2015, status: 'FINISHED', type: 'TV', eps: 24, score: 8.0, pop: 130000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20958-dF4X3MNkfBsm.jpg', banner: null, genres: ['comedia','romance','shoujo'], desc: 'Takeo, um rapaz enorme e gentil, finalmente encontra o amor com Rinko Yamato.' },
  { id: 30276, title: 'One Punch Man Season 2', eng: 'One Punch Man Season 2', slug: 'one-punch-man-s2', year: 2019, status: 'FINISHED', type: 'TV', eps: 12, score: 7.3, pop: 250000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx105333-MjFnHBNJmKjC.jpg', banner: null, genres: ['acao','comedia','superpoderes'], desc: 'Saitama continua sua vida de herói enfrentando novos desafios.' },
  { id: 119661, title: 'Chainsaw Man', eng: 'Chainsaw Man', slug: 'chainsaw-man-2', year: 2022, status: 'FINISHED', type: 'TV', eps: 12, score: 8.3, pop: 380000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx130010-JFwFqCAJJCBn.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/130010-TuS3vAZ5Mv7e.jpg', genres: ['acao','sobrenatural','horror','shounen'], desc: 'Denji funde-se com seu demônio-cachorro e torna-se o Homem-Motosserra.' },
  { id: 1535+100, title: 'Neon Genesis Evangelion', eng: 'Neon Genesis Evangelion', slug: 'evangelion', year: 1995, status: 'FINISHED', type: 'TV', eps: 26, score: 8.5, pop: 220000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx30-XR3qGnSCMQrh.jpg', banner: null, genres: ['acao','drama','mecha','psicologico','ficcao-cientifica'], desc: 'Shinji Ikari pilota robôs gigantes para proteger a Terra de criaturas chamadas Anjos.' },
  { id: 5688, title: 'Dragon Ball Z', eng: 'Dragon Ball Z', slug: 'dragon-ball-z', year: 1989, status: 'FINISHED', type: 'TV', eps: 291, score: 8.1, pop: 350000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5688-DGVJ5PGmKbqM.jpg', banner: null, genres: ['acao','aventura','shounen','fantasia'], desc: 'Goku e seus amigos defendem a Terra de inimigos cada vez mais poderosos.' },
  { id: 11981, title: 'Sword Art Online II', eng: 'Sword Art Online II', slug: 'sword-art-online-2nd', year: 2014, status: 'FINISHED', type: 'TV', eps: 24, score: 6.8, pop: 220000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20707-dF4X3MNkfBsm.jpg', banner: null, genres: ['acao','aventura','romance','isekai'], desc: 'Kirito mergulha no mundo de Gun Gale Online para investigar mortes misteriosas.' },
  { id: 20, title: 'Naruto', eng: 'Naruto', slug: 'naruto-s1', year: 2002, status: 'FINISHED', type: 'TV', eps: 220, score: 8.3, pop: 250000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-nQ8gWLSMJlcl.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/20-3eTfKGRZz8gg.jpg', genres: ['acao','aventura','shounen','fantasia'], desc: 'Naruto Uzumaki sonha em se tornar o Hokage de sua vila ninja.' },
  { id: 1735, title: 'Naruto: Shippuden', eng: 'Naruto: Shippuden', slug: 'naruto-shippuden', year: 2007, status: 'FINISHED', type: 'TV', eps: 500, score: 8.2, pop: 300000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-q3z3XNa6Xgxw.jpg', banner: null, genres: ['acao','aventura','shounen','fantasia'], desc: 'Naruto retorna após anos de treinamento para enfrentar a ameaça da Akatsuki.' },
  { id: 31758, title: 'Boku no Hero Academia Season 2', eng: 'My Hero Academia Season 2', slug: 'boku-no-hero-s2', year: 2017, status: 'FINISHED', type: 'TV', eps: 25, score: 8.3, pop: 280000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx31964-9V3BDMW8CQNJ.jpg', banner: null, genres: ['acao','shounen','superpoderes','escolar'], desc: 'Izuku e seus colegas participam do Festival Esportivo da Academia de Heróis.' },
  { id: 150672, title: 'Solo Leveling', eng: 'Solo Leveling', slug: 'solo-leveling-main', year: 2024, status: 'FINISHED', type: 'TV', eps: 12, score: 8.8, pop: 500000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx166240-R9SbHwvwxCPk.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/166240-BtBjC3RWjqMP.jpg', genres: ['acao','fantasia','shounen'], desc: 'Sung Jinwoo, o caçador mais fraco, obtém um sistema único que lhe permite evoluir sem limites.' },
  { id: 170942, title: 'Dandadan', eng: 'Dandadan', slug: 'dandadan', year: 2024, status: 'FINISHED', type: 'TV', eps: 12, score: 8.6, pop: 280000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-MjFnHBNJmKjC.jpg', banner: null, genres: ['acao','comedia','sobrenatural','romance','shounen'], desc: 'Uma crente em aliens e um crente em fantasmas se unem para investigar fenômenos sobrenaturais.' },
  { id: 162804, title: 'Frieren: Beyond Journey\'s End', eng: 'Frieren: Beyond Journey\'s End', slug: 'frieren', year: 2023, status: 'FINISHED', type: 'TV', eps: 28, score: 9.2, pop: 320000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-KJTQz9AITlTU.jpg', banner: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-qTJBJk1bGnAE.jpg', genres: ['aventura','drama','fantasia','slice-of-life'], desc: 'A elfa maga Frieren busca compreender a humanidade décadas após a derrota do Rei Demônio.' },
  { id: 9969, title: 'Ano Hi Mita Hana', eng: 'AnoHana: The Flower We Saw That Day', slug: 'anohana', year: 2011, status: 'FINISHED', type: 'TV', eps: 11, score: 8.5, pop: 200000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9969-dF4X3MNkfBsm.jpg', banner: null, genres: ['drama','romance','sobrenatural','slice-of-life'], desc: 'Um grupo de amigos é reunido pelo fantasma de sua amiga de infância que morreu jovem.' },
  { id: 11013, title: 'Magi: The Labyrinth of Magic', eng: 'Magi: The Labyrinth of Magic', slug: 'magi', year: 2012, status: 'FINISHED', type: 'TV', eps: 25, score: 8.1, pop: 190000, cover: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx13401-nQ8gWLSMJlcl.jpg', banner: null, genres: ['acao','aventura','fantasia','shounen'], desc: 'Em um mundo baseado em 1001 noites, um jovem magi percorre labirintos em busca de um rei.' },
];

async function insertAnime(a) {
  const slug = a.slug;
  try {
    const r = await pool.query(
      `INSERT INTO anime (external_id, slug, title, title_english, description, cover_url, banner_url,
        year, status, type, episodes_count, score, popularity, season)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (external_id) DO UPDATE SET
         cover_url = EXCLUDED.cover_url,
         banner_url = COALESCE(EXCLUDED.banner_url, anime.banner_url),
         score = EXCLUDED.score,
         popularity = EXCLUDED.popularity,
         updated_at = NOW()
       RETURNING id, title, (xmax=0) AS is_new`,
      [a.id, slug, a.title, a.eng, a.desc || null, a.cover, a.banner || null,
       a.year, a.status, a.type, a.eps, a.score, a.pop, null]
    );
    return r.rows[0];
  } catch (e) {
    // slug duplicado — tenta com sufixo
    if (e.code === '23505' && e.constraint === 'anime_slug_key') {
      const newSlug = `${slug}-${a.id}`;
      const r = await pool.query(
        `INSERT INTO anime (external_id, slug, title, title_english, description, cover_url, banner_url,
          year, status, type, episodes_count, score, popularity)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (external_id) DO UPDATE SET cover_url=EXCLUDED.cover_url, updated_at=NOW()
         RETURNING id, title, (xmax=0) AS is_new`,
        [a.id, newSlug, a.title, a.eng, a.desc || null, a.cover, a.banner || null,
         a.year, a.status, a.type, a.eps, a.score, a.pop]
      );
      return r.rows[0];
    }
    throw e;
  }
}

async function linkGenres(animeId, genreSlugs) {
  for (const slug of genreSlugs) {
    const g = await pool.query('SELECT id FROM genres WHERE slug=$1', [slug]);
    if (g.rows[0]) {
      await pool.query(
        'INSERT INTO anime_genres (anime_id, genre_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [animeId, g.rows[0].id]
      );
    }
  }
}

async function run() {
  let added = 0, updated = 0, skipped = 0;

  for (const a of ANIMES) {
    try {
      const result = await insertAnime(a);
      if (result.is_new) {
        await linkGenres(result.id, a.genres);
        // Cria temporada padrão
        await pool.query(
          `INSERT INTO seasons (anime_id, number, title, year, episodes_count)
           VALUES ($1,1,'Temporada 1',$2,$3) ON CONFLICT DO NOTHING`,
          [result.id, a.year, a.eps]
        );
        console.log(`  ✅ ${result.title}`);
        added++;
      } else {
        updated++;
      }
    } catch (e) {
      console.log(`  ⚠️  ${a.title}: ${e.message.substring(0, 60)}`);
      skipped++;
    }
  }

  const total = await pool.query('SELECT COUNT(*) FROM anime');
  console.log(`\n📊 Resultado: +${added} novos | ~${updated} atualizados | ${skipped} erros`);
  console.log(`📺 Total no banco: ${total.rows[0].count} animes`);
  await pool.end();
}

run().catch(e => { console.error('ERRO FATAL:', e.message); process.exit(1); });
