TRUNCATE xss_tokens,solves,challenges,order_discounts,order_items,orders,cart_coupons,coupons,cart_items,sessions,products,users RESTART IDENTITY CASCADE;
-- Passwort-Hashes werden vom Reset-Skript gesetzt. Admin kann sich nicht anmelden.
INSERT INTO users(username,password_hash,balance,private_note) VALUES
 ('alice','disabled',10000,''),('bob','disabled',2000,'Fiktive VIP-Notiz: Lieferung an das geheime Wolkenatelier, Fach B-42.'),('admin','disabled',0,'');
INSERT INTO products(name,description,price,color,category,is_flag) VALUES
 ('Cloud Labubu','Ein kleiner Tagtraum in Cremeweiß. Fiktive Sammelfigur mit flauschigem Wolken-Look – perfekt für deinen Schreibtisch.',1290,'cream','Einzelfigur',false),
 ('Matcha Labubu','Eine ruhige Auszeit in sanftem Grün. Unsere fiktive Matcha-Edition bringt frischen Wind in deine Sammlung.',1590,'green','Einzelfigur',false),
 ('Berry Blind Box','Welche Figur wartet auf dich? Eine fiktive Überraschungsbox in Beerentönen. Jede Box ist ein kleiner Glücksmoment.',1890,'pink','Blind Box',false),
 ('Midnight Labubu','Für Nachteulen und Sternensammler. Eine fiktive Sonderedition in tiefem Blau mit kleinen Sternendetails.',2490,'blue','Sonderedition',false),
 ('Peach Mini','Klein, sonnig und immer dabei. Diese fiktive Mini-Figur in Pfirsichorange passt in jede Sammlung.',500,'peach','Mini',false),
 ('Golden Labubu (Flag)','Das goldene Highlight unserer Kollektion. Eine exklusive fiktive Figur und das Ziel der Gutschein-Challenge.',133700,'gold','Sonderedition',true);
INSERT INTO coupons VALUES ('LABUBU20',20);
INSERT INTO orders(user_id,total,subtotal,note) VALUES (3,1290,1290,''),(2,500,500,'Fiktive Testbestellung von Bob.'),(1,1290,1290,'Fiktive Testbestellung von Alice.');
INSERT INTO order_items(order_id,product_id,name,price,quantity) VALUES (1,1,'Cloud Labubu',1290,1),(2,5,'Peach Mini',500,1),(3,1,'Cloud Labubu',1290,1);
