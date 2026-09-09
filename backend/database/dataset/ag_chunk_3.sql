SET client_encoding TO UTF8;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9493 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=7081 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=7081 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10348 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10338 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10338 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10338 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10338 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10359 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10359 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10359 AND g.slug='mahou-shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10359 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10014 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10014 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10324 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10324 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10324 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10324 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10324 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10513 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10513 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10513 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=31534 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10346 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10346 AND g.slug='esportes-de-combate'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10506 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10347 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10347 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10347 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10540 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10459 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=31517 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=31517 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10541 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10533 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10633 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8143 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10162 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10162 AND g.slug='childcare'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10162 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10162 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='crossdressing'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10110 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10161 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10161 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10161 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10161 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10490 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8516 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8516 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8516 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8516 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8516 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='premiado'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='girls-love'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10495 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='avant-garde'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10721 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10379 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10379 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10379 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10379 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10379 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10568 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10568 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='idols-male'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='reverse-harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10321 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10049 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10049 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10049 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10049 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10278 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10278 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10278 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10278 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8915 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8915 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8915 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8915 AND g.slug='detetive'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8915 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9750 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10611 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10611 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10611 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10611 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10611 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10465 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10572 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10572 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10572 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10572 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10572 AND g.slug='team-sports'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10156 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10156 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10156 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10156 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10372 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10372 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10372 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9938 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9938 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9938 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9938 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6920 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6920 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6920 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6920 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6920 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10197 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10197 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10197 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10197 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9934 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9934 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9934 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9934 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10671 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10671 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10838 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10838 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10838 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10217 AND g.slug='mahou-shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11835 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11835 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11835 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11835 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10908 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10847 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10847 AND g.slug='childcare'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10847 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10847 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10802 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10802 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=35920 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=35920 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10797 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10797 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11609 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11589 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10995 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11061 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11061 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11061 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11061 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='jogos-de-apostas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='sobrevivencia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10620 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10087 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10087 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10087 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10793 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10793 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10793 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10793 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10719 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10719 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10719 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10719 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10719 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10800 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10030 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10030 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10030 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10030 AND g.slug='cultura-otaku'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10030 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10396 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10396 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10396 AND g.slug='culinaria'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10396 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10213 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9936 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10521 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10521 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10521 AND g.slug='love-status-quo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10521 AND g.slug='trabalho'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10521 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10588 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=6773 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10460 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10460 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10460 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10460 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10456 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10456 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10456 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10578 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11123 AND g.slug='boys-love'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11123 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11123 AND g.slug='cultura-otaku'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11123 AND g.slug='trabalho'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10397 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10397 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10397 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10397 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10798 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10798 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10798 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10798 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10798 AND g.slug='detetive'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9981 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9981 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9981 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9981 AND g.slug='jogos-de-apostas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=9981 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10378 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10378 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10378 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10232 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10232 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10232 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10336 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10336 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10336 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10808 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10808 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10808 AND g.slug='espacial'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11385 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11385 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11385 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11385 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11385 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11457 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11457 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11457 AND g.slug='childcare'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11457 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11457 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11615 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11615 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11177 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11177 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10958 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10958 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10958 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11809 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11547 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11547 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11547 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11547 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11547 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11017 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11017 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11541 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33739 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33739 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33739 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10997 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12181 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12181 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12181 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=38571 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=38571 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=54178 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11111 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11111 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11111 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11111 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11617 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11843 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11843 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11843 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11597 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11597 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11597 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11597 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11013 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11013 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11013 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11013 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11013 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11319 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11433 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11433 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11433 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11433 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11285 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11285 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11285 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11285 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11665 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11665 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11665 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11665 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11665 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11179 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11179 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11179 AND g.slug='childcare'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11235 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11235 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11241 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11079 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11079 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11079 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11751 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11751 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11751 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11751 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10447 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10447 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10447 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10447 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11697 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11697 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11697 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11697 AND g.slug='team-sports'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11697 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11227 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11227 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11227 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8917 AND g.slug='premiado'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8917 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=8917 AND g.slug='espacial'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11371 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11371 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11371 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11491 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11491 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11491 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12191 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12191 AND g.slug='mahou-shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11769 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11769 AND g.slug='girls-love'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11769 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11769 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11769 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12021 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12021 AND g.slug='pets'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12021 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11341 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11341 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11341 AND g.slug='detetive'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11341 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11341 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12651 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12651 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13207 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13207 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13207 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12189 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12189 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12189 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11771 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11771 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11771 AND g.slug='team-sports'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11771 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11741 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11741 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11741 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11759 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11759 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11759 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11759 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11759 AND g.slug='video-game'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11499 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12445 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12531 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='organized-crime'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12413 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10790 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11785 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11785 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11785 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12467 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12467 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12467 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12291 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12291 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12291 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12291 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11761 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12431 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12431 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12431 AND g.slug='espacial'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12431 AND g.slug='trabalho'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12431 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12883 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12883 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11837 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12461 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12461 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12461 AND g.slug='reverse-harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12461 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12979 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12979 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12979 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12979 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12815 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12815 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12815 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12815 AND g.slug='trabalho'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12815 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12471 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12471 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12471 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12471 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11739 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11739 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11739 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11739 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='premiado'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13203 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13261 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13261 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13261 AND g.slug='team-sports'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13261 AND g.slug='viagem-no-tempo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12149 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12149 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12149 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12929 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12753 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12753 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12753 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12753 AND g.slug='jogos-de-apostas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12753 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12367 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12367 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12367 AND g.slug='culinaria'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12367 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12367 AND g.slug='trabalho'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11859 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11859 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11859 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11859 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12119 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12119 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12119 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10884 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10884 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10884 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13377 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13377 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13377 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12875 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12875 AND g.slug='team-sports'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13145 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13145 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12611 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12611 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12611 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12611 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12677 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12677 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12677 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13163 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13163 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13163 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13159 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13159 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13159 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12863 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12863 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12863 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13141 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12123 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12123 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12123 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13139 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13139 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12963 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12963 AND g.slug='mahou-shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=18845 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13029 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13029 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13029 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13431 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13431 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13431 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13455 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=35317 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=35317 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=22585 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13459 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=60414 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=60414 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=60414 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11757 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11757 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11757 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11757 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11757 AND g.slug='video-game'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11887 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11887 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11887 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11887 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11887 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13161 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13161 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13161 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13161 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13161 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12549 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12293 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11933 AND g.slug='viagem-no-tempo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12175 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12175 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12175 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12175 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12031 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12031 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12031 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12031 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13535 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13535 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13535 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13535 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13535 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13367 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12967 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12967 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12967 AND g.slug='reverse-harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12403 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12403 AND g.slug='girls-love'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12403 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12403 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12403 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10357 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10357 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10357 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=10357 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='artes-cenicas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12679 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13333 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13333 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13333 AND g.slug='artes-cenicas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13333 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11783 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11783 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11783 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11783 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11021 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11021 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11021 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11021 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11021 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13585 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13585 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13585 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13585 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13585 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12487 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12487 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12487 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14093 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14093 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14093 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14093 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14093 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13115 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13349 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13349 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13349 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13349 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12281 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12281 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12281 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13409 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13409 AND g.slug='culinaria'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13409 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13409 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13409 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14277 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14277 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14277 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14277 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14333 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14333 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14563 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14563 AND g.slug='mahou-shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14693 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14693 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14693 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=36423 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=36423 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='vampiro'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14719 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='detetive'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13601 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14741 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14741 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14741 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13759 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13759 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13759 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14227 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14227 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14227 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14227 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14513 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14513 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14513 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14513 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='gore'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='jogos-de-apostas'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='sobrevivencia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14345 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='suspense'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13125 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14467 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14467 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14467 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14713 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14713 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14713 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14713 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14713 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14289 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14289 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14289 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14289 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14075 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13663 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='samurai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15417 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11703 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11703 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11703 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11703 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12365 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12365 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12365 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12365 AND g.slug='cultura-otaku'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=12365 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14131 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14131 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14131 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14131 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14199 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14199 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14199 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14199 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14199 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13655 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13655 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13655 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='elenco-adulto'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='militar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='organized-crime'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13331 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13599 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13599 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13599 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13599 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15059 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15059 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15059 AND g.slug='corrida'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15059 AND g.slug='seinen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14527 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14765 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14765 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14765 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14765 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15125 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15125 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15125 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15125 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14653 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14653 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14653 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14653 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14653 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14645 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14645 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14645 AND g.slug='reverse-harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14645 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15061 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15061 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15061 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15061 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15489 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15489 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15489 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15489 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14237 AND g.slug='ficcao-cientifica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14237 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14237 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11239 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11239 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11239 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11239 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=11239 AND g.slug='visual-arts'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15045 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15045 AND g.slug='horror'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15045 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15045 AND g.slug='psicologico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15313 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15313 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15043 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15043 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13185 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=13185 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14989 AND g.slug='mecha'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14989 AND g.slug='corrida'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15547 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15547 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14913 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14913 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14913 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=30151 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=30151 AND g.slug='antropomorfico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15905 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15905 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15905 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15905 AND g.slug='artes-marciais'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15787 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15787 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33753 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33753 AND g.slug='historico'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=33753 AND g.slug='infantil'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15315 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15315 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15315 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15315 AND g.slug='isekai'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15315 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14749 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14749 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14749 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14749 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14967 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14967 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14967 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14967 AND g.slug='harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14967 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14833 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14833 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14833 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15051 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15051 AND g.slug='idols'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15051 AND g.slug='musica'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15051 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=16417 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=16417 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15379 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15379 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15379 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15379 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15085 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15085 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15085 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15085 AND g.slug='reverse-harem'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='drama'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='romance'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='esportes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='triangulo-amoroso'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='jogo-de-estrategia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14397 AND g.slug='josei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14811 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14811 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=16005 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=16005 AND g.slug='superpoderes'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=16005 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15119 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15119 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15119 AND g.slug='ecchi'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15119 AND g.slug='escolar'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15751 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15751 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15751 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15751 AND g.slug='parodia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15751 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15613 AND g.slug='acao'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15613 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15613 AND g.slug='sobrenatural'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15613 AND g.slug='mitologia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15613 AND g.slug='shoujo'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='comedia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='fantasia'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='misterio'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='detetive'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='gag-humor'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='organized-crime'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='fantasia-urbana'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=15109 AND g.slug='shounen'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14355 AND g.slug='aventura'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14355 AND g.slug='slice-of-life'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14355 AND g.slug='cgdct'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14355 AND g.slug='iyashikei'
ON CONFLICT DO NOTHING;
INSERT INTO anime_genres (anime_id,genre_id)
SELECT a.id,g.id FROM anime a,genres g WHERE a.external_id=14515 AND g.slug='comedia'
ON CONFLICT DO NOTHING;