// Valori per 100g. Fonti: INRAN/Tabelle di composizione degli alimenti, USDA.
export interface FoodDB {
  nome: string;
  kcal: number;
  proteine: number;
  carboidrati: number;
  grassi: number;
  sinonimi?: string[];
  crudo_cotto?: 'crudo' | 'cotto';
  categoria?: string;
}

export const FOOD_DB: FoodDB[] = [
  // === CARNE ===
  { nome: 'Petto di pollo crudo', kcal: 110, proteine: 23, carboidrati: 0, grassi: 1.2, crudo_cotto: 'crudo', categoria: 'carne', sinonimi: ['pollo crudo', 'petto pollo'] },
  { nome: 'Petto di pollo cotto', kcal: 165, proteine: 31, carboidrati: 0, grassi: 3.6, crudo_cotto: 'cotto', categoria: 'carne', sinonimi: ['pollo cotto', 'pollo alla griglia', 'petto pollo cotto'] },
  { nome: 'Coscia di pollo', kcal: 209, proteine: 26, carboidrati: 0, grassi: 11, categoria: 'carne', sinonimi: ['coscia pollo'] },
  { nome: 'Fesa di tacchino', kcal: 135, proteine: 24, carboidrati: 0, grassi: 3, categoria: 'carne', sinonimi: ['tacchino', 'fesa tacchino'] },
  { nome: 'Manzo magro crudo', kcal: 160, proteine: 22, carboidrati: 0, grassi: 7, crudo_cotto: 'crudo', categoria: 'carne', sinonimi: ['carne di manzo', 'manzo'] },
  { nome: 'Manzo magro cotto', kcal: 217, proteine: 26, carboidrati: 0, grassi: 12, crudo_cotto: 'cotto', categoria: 'carne', sinonimi: ['manzo cotto', 'bistecca'] },
  { nome: 'Bistecca fiorentina', kcal: 250, proteine: 27, carboidrati: 0, grassi: 17, categoria: 'carne' },
  { nome: 'Macinato di manzo', kcal: 254, proteine: 26, carboidrati: 0, grassi: 17, categoria: 'carne', sinonimi: ['carne macinata', 'manzo macinato'] },
  { nome: 'Salsiccia', kcal: 301, proteine: 15, carboidrati: 1, grassi: 26, categoria: 'carne' },
  { nome: 'Prosciutto crudo', kcal: 215, proteine: 26, carboidrati: 0.5, grassi: 12, categoria: 'salume' },
  { nome: 'Prosciutto cotto', kcal: 145, proteine: 22, carboidrati: 1.5, grassi: 5.5, categoria: 'salume' },
  { nome: 'Speck', kcal: 318, proteine: 20, carboidrati: 0.5, grassi: 25, categoria: 'salume' },
  { nome: 'Pancetta', kcal: 499, proteine: 13, carboidrati: 0.5, grassi: 48, categoria: 'salume' },
  { nome: 'Bresaola', kcal: 151, proteine: 32, carboidrati: 0.5, grassi: 2.5, categoria: 'salume' },
  { nome: 'Cotoletta di vitello', kcal: 219, proteine: 25, carboidrati: 0, grassi: 13, categoria: 'carne' },
  { nome: 'Maiale lonza', kcal: 199, proteine: 28, carboidrati: 0, grassi: 9, categoria: 'carne', sinonimi: ['lonza', 'arrosto di maiale'] },
  { nome: 'Pollo fritto', kcal: 246, proteine: 25, carboidrati: 8, grassi: 13, categoria: 'carne' },

  // === PESCE ===
  { nome: 'Salmone crudo', kcal: 208, proteine: 20, carboidrati: 0, grassi: 13, crudo_cotto: 'crudo', categoria: 'pesce' },
  { nome: 'Salmone cotto', kcal: 220, proteine: 22, carboidrati: 0, grassi: 14, crudo_cotto: 'cotto', categoria: 'pesce' },
  { nome: 'Salmone affumicato', kcal: 117, proteine: 18, carboidrati: 0, grassi: 4.3, categoria: 'pesce' },
  { nome: 'Tonno fresco', kcal: 144, proteine: 23, carboidrati: 0, grassi: 5, categoria: 'pesce' },
  { nome: 'Tonno in scatola (al naturale)', kcal: 116, proteine: 26, carboidrati: 0, grassi: 1, categoria: 'pesce', sinonimi: ['tonno scatola', 'tonno'] },
  { nome: 'Tonno in scatola (sott\'olio)', kcal: 198, proteine: 25, carboidrati: 0, grassi: 10, categoria: 'pesce' },
  { nome: 'Merluzzo', kcal: 82, proteine: 18, carboidrati: 0, grassi: 0.7, categoria: 'pesce', sinonimi: ['merluzzo cotto', 'filetto di merluzzo'] },
  { nome: 'Branzino', kcal: 97, proteine: 18, carboidrati: 0, grassi: 2.5, categoria: 'pesce', sinonimi: ['spigola'] },
  { nome: 'Orata', kcal: 97, proteine: 18, carboidrati: 0, grassi: 2.5, categoria: 'pesce' },
  { nome: 'Gamberi', kcal: 87, proteine: 20, carboidrati: 0.2, grassi: 0.5, categoria: 'pesce', sinonimi: ['gamberetti'] },
  { nome: 'Calamari', kcal: 92, proteine: 15, carboidrati: 3, grassi: 1.5, categoria: 'pesce' },
  { nome: 'Polpo', kcal: 82, proteine: 14, carboidrati: 2, grassi: 1, categoria: 'pesce' },
  { nome: 'Acciughe', kcal: 131, proteine: 20, carboidrati: 0, grassi: 5, categoria: 'pesce', sinonimi: ['alice', 'alici'] },
  { nome: 'Sgombro', kcal: 205, proteine: 18, carboidrati: 0, grassi: 14, categoria: 'pesce' },
  { nome: 'Trota', kcal: 168, proteine: 20, carboidrati: 0, grassi: 9, categoria: 'pesce' },

  // === UOVA E LATTICINI ===
  { nome: 'Uovo intero crudo', kcal: 143, proteine: 13, carboidrati: 1.1, grassi: 10, crudo_cotto: 'crudo', categoria: 'uova', sinonimi: ['uovo', 'uova'] },
  { nome: 'Uovo sodo', kcal: 155, proteine: 13, carboidrati: 1.1, grassi: 11, crudo_cotto: 'cotto', categoria: 'uova', sinonimi: ['uovo cotto'] },
  { nome: 'Albumi', kcal: 52, proteine: 11, carboidrati: 0.7, grassi: 0.2, categoria: 'uova', sinonimi: ['albume', 'chiara d\'uovo'] },
  { nome: 'Latte intero', kcal: 61, proteine: 3.2, carboidrati: 4.8, grassi: 3.3, categoria: 'latticini' },
  { nome: 'Latte scremato', kcal: 34, proteine: 3.4, carboidrati: 5, grassi: 0.1, categoria: 'latticini', sinonimi: ['latte magro'] },
  { nome: 'Latte parzialmente scremato', kcal: 46, proteine: 3.4, carboidrati: 4.9, grassi: 1.8, categoria: 'latticini' },
  { nome: 'Yogurt greco', kcal: 59, proteine: 10, carboidrati: 3.6, grassi: 0.4, categoria: 'latticini' },
  { nome: 'Yogurt bianco intero', kcal: 61, proteine: 3.5, carboidrati: 4.7, grassi: 3.3, categoria: 'latticini' },
  { nome: 'Yogurt alla frutta', kcal: 95, proteine: 3.5, carboidrati: 15, grassi: 2.5, categoria: 'latticini' },
  { nome: 'Mozzarella', kcal: 280, proteine: 18, carboidrati: 3.1, grassi: 22, categoria: 'latticini' },
  { nome: 'Mozzarella light', kcal: 180, proteine: 22, carboidrati: 2.5, grassi: 8, categoria: 'latticini' },
  { nome: 'Mozzarella di bufala', kcal: 300, proteine: 18, carboidrati: 1.7, grassi: 24, categoria: 'latticini' },
  { nome: 'Parmigiano reggiano', kcal: 392, proteine: 36, carboidrati: 4, grassi: 26, categoria: 'latticini', sinonimi: ['parmigiano', 'grana'] },
  { nome: 'Grana padano', kcal: 392, proteine: 35, carboidrati: 4, grassi: 27, categoria: 'latticini' },
  { nome: 'Pecorino romano', kcal: 387, proteine: 32, carboidrati: 4, grassi: 26, categoria: 'latticini' },
  { nome: 'Ricotta di mucca', kcal: 174, proteine: 11, carboidrati: 5, grassi: 12, categoria: 'latticini' },
  { nome: 'Ricotta di pecora', kcal: 128, proteine: 9, carboidrati: 4, grassi: 8, categoria: 'latticini' },
  { nome: 'Fontina', kcal: 350, proteine: 23, carboidrati: 1, grassi: 28, categoria: 'latticini' },
  { nome: 'Gorgonzola', kcal: 330, proteine: 19, carboidrati: 2, grassi: 27, categoria: 'latticini' },
  { nome: 'Stracchino', kcal: 280, proteine: 16, carboidrati: 2, grassi: 24, categoria: 'latticini' },
  { nome: 'Fior di latte', kcal: 252, proteine: 17, carboidrati: 3, grassi: 19, categoria: 'latticini' },

  // === CEREALI E FARINACEI ===
  { nome: 'Riso bianco crudo', kcal: 360, proteine: 7, carboidrati: 80, grassi: 0.5, crudo_cotto: 'crudo', categoria: 'cereali' },
  { nome: 'Riso bianco cotto', kcal: 130, proteine: 2.7, carboidrati: 28, grassi: 0.3, crudo_cotto: 'cotto', categoria: 'cereali', sinonimi: ['riso', 'riso bollito'] },
  { nome: 'Riso integrale cotto', kcal: 123, proteine: 2.7, carboidrati: 26, grassi: 1, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Riso basmati cotto', kcal: 121, proteine: 3, carboidrati: 25, grassi: 0.2, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Riso carnaroli cotto', kcal: 130, proteine: 2.7, carboidrati: 28, grassi: 0.4, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Pasta secca cruda', kcal: 364, proteine: 13, carboidrati: 75, grassi: 1.5, crudo_cotto: 'crudo', categoria: 'cereali' },
  { nome: 'Pasta cotta', kcal: 158, proteine: 5.8, carboidrati: 31, grassi: 0.9, crudo_cotto: 'cotto', categoria: 'cereali', sinonimi: ['pasta', 'spaghetti', 'penne', 'fusilli', 'rigatoni'] },
  { nome: 'Pasta integrale cotta', kcal: 147, proteine: 6.5, carboidrati: 30, grassi: 0.9, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Pasta all\'uovo cotta', kcal: 168, proteine: 6.5, carboidrati: 31, grassi: 2, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Pane bianco', kcal: 265, proteine: 9, carboidrati: 49, grassi: 3.2, categoria: 'cereali', sinonimi: ['pane', 'pancarrè'] },
  { nome: 'Pane integrale', kcal: 247, proteine: 13, carboidrati: 41, grassi: 4.2, categoria: 'cereali' },
  { nome: 'Pane ai cereali', kcal: 250, proteine: 10, carboidrati: 45, grassi: 3.5, categoria: 'cereali' },
  { nome: 'Focaccia', kcal: 285, proteine: 7, carboidrati: 50, grassi: 6, categoria: 'cereali' },
  { nome: 'Pizza margherita', kcal: 270, proteine: 11, carboidrati: 33, grassi: 10, categoria: 'cereali', sinonimi: ['pizza'] },
  { nome: 'Pizza di pane', kcal: 270, proteine: 9, carboidrati: 53, grassi: 1.5, categoria: 'cereali' },
  { nome: 'Grissini', kcal: 383, proteine: 11, carboidrati: 78, grassi: 4, categoria: 'cereali' },
  { nome: 'Crackers', kcal: 410, proteine: 10, carboidrati: 78, grassi: 7, categoria: 'cereali' },
  { nome: 'Avena', kcal: 389, proteine: 17, carboidrati: 66, grassi: 7, categoria: 'cereali', sinonimi: ['fiocchi d\'avena', 'porridge'] },
  { nome: 'Quinoa cotta', kcal: 120, proteine: 4.4, carboidrati: 21, grassi: 1.9, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Farro cotto', kcal: 130, proteine: 4, carboidrati: 27, grassi: 0.5, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Cous cous cotto', kcal: 112, proteine: 3.8, carboidrati: 23, grassi: 0.2, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Polenta cotta', kcal: 80, proteine: 1.7, carboidrati: 17, grassi: 0.4, crudo_cotto: 'cotto', categoria: 'cereali' },
  { nome: 'Gnocchi di patate', kcal: 130, proteine: 3, carboidrati: 26, grassi: 0.5, categoria: 'cereali' },
  { nome: 'Lasagne', kcal: 235, proteine: 11, carboidrati: 22, grassi: 11, categoria: 'cereali' },

  // === PIATTI COMPOSTI ===
  { nome: 'Pasta al pomodoro', kcal: 180, proteine: 6, carboidrati: 33, grassi: 3, categoria: 'piatto', sinonimi: ['pasta al sugo'] },
  { nome: 'Pasta al ragù', kcal: 215, proteine: 11, carboidrati: 33, grassi: 5.5, categoria: 'piatto', sinonimi: ['pasta bolognese', 'ragù'] },
  { nome: 'Pasta alla carbonara', kcal: 310, proteine: 13, carboidrati: 35, grassi: 13, categoria: 'piatto', sinonimi: ['carbonara'] },
  { nome: 'Pasta al pesto', kcal: 290, proteine: 8, carboidrati: 35, grassi: 12, categoria: 'piatto', sinonimi: ['pesto'] },
  { nome: 'Pasta cacio e pepe', kcal: 320, proteine: 12, carboidrati: 38, grassi: 13, categoria: 'piatto' },
  { nome: 'Pasta amatriciana', kcal: 230, proteine: 9, carboidrati: 34, grassi: 7, categoria: 'piatto' },
  { nome: 'Risotto allo zafferano', kcal: 165, proteine: 4, carboidrati: 28, grassi: 3.5, categoria: 'piatto', sinonimi: ['risotto alla milanese'] },
  { nome: 'Risotto ai funghi', kcal: 155, proteine: 4, carboidrati: 27, grassi: 3, categoria: 'piatto' },
  { nome: 'Risotto alla pescatora', kcal: 145, proteine: 9, carboidrati: 23, grassi: 2.5, categoria: 'piatto' },
  { nome: 'Cotoletta alla milanese', kcal: 340, proteine: 22, carboidrati: 12, grassi: 22, categoria: 'piatto' },
  { nome: 'Saltimbocca alla romana', kcal: 220, proteine: 25, carboidrati: 1, grassi: 13, categoria: 'piatto' },
  { nome: 'Ossobuco', kcal: 230, proteine: 24, carboidrati: 2, grassi: 14, categoria: 'piatto' },
  { nome: 'Pollo al curry', kcal: 165, proteine: 18, carboidrati: 5, grassi: 8, categoria: 'piatto' },
  { nome: 'Pollo al limone', kcal: 150, proteine: 22, carboidrati: 3, grassi: 6, categoria: 'piatto' },
  { nome: 'Polpette al sugo', kcal: 240, proteine: 18, carboidrati: 8, grassi: 15, categoria: 'piatto', sinonimi: ['polpette'] },
  { nome: 'Polpo alla luciana', kcal: 130, proteine: 14, carboidrati: 5, grassi: 5, categoria: 'piatto' },
  { nome: 'Frittata', kcal: 180, proteine: 13, carboidrati: 1.5, grassi: 14, categoria: 'piatto', sinonimi: ['frittata di uova'] },
  { nome: 'Frittata di verdure', kcal: 130, proteine: 9, carboidrati: 4, grassi: 9, categoria: 'piatto' },
  { nome: 'Uova strapazzate', kcal: 155, proteine: 12, carboidrati: 1, grassi: 12, categoria: 'piatto' },
  { nome: 'Hamburger classico', kcal: 295, proteine: 17, carboidrati: 30, grassi: 12, categoria: 'piatto', sinonimi: ['burger'] },
  { nome: 'Kebab', kcal: 215, proteine: 15, carboidrati: 18, grassi: 10, categoria: 'piatto' },
  { nome: 'Sushi (nigiri)', kcal: 150, proteine: 6, carboidrati: 28, grassi: 1, categoria: 'piatto' },
  { nome: 'Caponata', kcal: 110, proteine: 2, carboidrati: 13, grassi: 6, categoria: 'piatto' },
  { nome: 'Parmigiana di melanzane', kcal: 230, proteine: 8, carboidrati: 14, grassi: 16, categoria: 'piatto' },
  { nome: 'Insalata di riso', kcal: 175, proteine: 6, carboidrati: 27, grassi: 4, categoria: 'piatto' },
  { nome: 'Insalatona mista', kcal: 90, proteine: 5, carboidrati: 8, grassi: 4, categoria: 'piatto' },
  { nome: 'Zuppa di legumi', kcal: 110, proteine: 7, carboidrati: 16, grassi: 1.5, categoria: 'piatto' },
  { nome: 'Minestrone', kcal: 35, proteine: 1.5, carboidrati: 6, grassi: 0.5, categoria: 'piatto' },
  { nome: 'Ramen', kcal: 110, proteine: 5, carboidrati: 17, grassi: 2.5, categoria: 'piatto' },
  { nome: 'Tiramisù', kcal: 340, proteine: 7, carboidrati: 30, grassi: 22, categoria: 'piatto', sinonimi: ['tiramisu'] },
  { nome: 'Panna cotta', kcal: 240, proteine: 4, carboidrati: 20, grassi: 17, categoria: 'piatto' },
  { nome: 'Cannolo siciliano', kcal: 320, proteine: 6, carboidrati: 32, grassi: 19, categoria: 'piatto' },

  // === VERDURE ===
  { nome: 'Pomodoro', kcal: 18, proteine: 0.9, carboidrati: 3.9, grassi: 0.2, categoria: 'verdura', sinonimi: ['pomodori', 'pomo d\'oro'] },
  { nome: 'Pomodorini', kcal: 18, proteine: 0.9, carboidrati: 3.9, grassi: 0.2, categoria: 'verdura', sinonimi: ['ciliegino', 'datterino'] },
  { nome: 'Insalata verde', kcal: 15, proteine: 1.4, carboidrati: 2.9, grassi: 0.2, categoria: 'verdura', sinonimi: ['lattuga', 'songino'] },
  { nome: 'Rucola', kcal: 25, proteine: 2.6, carboidrati: 3.7, grassi: 0.7, categoria: 'verdura' },
  { nome: 'Spinaci crudi', kcal: 23, proteine: 2.9, carboidrati: 3.6, grassi: 0.4, crudo_cotto: 'crudo', categoria: 'verdura' },
  { nome: 'Spinaci cotti', kcal: 23, proteine: 3, carboidrati: 3.5, grassi: 0.3, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Broccoli', kcal: 34, proteine: 2.8, carboidrati: 7, grassi: 0.4, categoria: 'verdura' },
  { nome: 'Cavolfiore', kcal: 25, proteine: 1.9, carboidrati: 5, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Cavolo broccolo', kcal: 28, proteine: 2.8, carboidrati: 5, grassi: 0.4, categoria: 'verdura' },
  { nome: 'Cavolo cappuccio', kcal: 24, proteine: 1.4, carboidrati: 5, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Zucchine', kcal: 17, proteine: 1.5, carboidrati: 3.1, grassi: 0.3, categoria: 'verdura', sinonimi: ['zucchini'] },
  { nome: 'Melanzane', kcal: 25, proteine: 1, carboidrati: 6, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Peperoni', kcal: 31, proteine: 1, carboidrati: 6, grassi: 0.3, categoria: 'verdura' },
  { nome: 'Cetrioli', kcal: 12, proteine: 0.8, carboidrati: 2, grassi: 0.1, categoria: 'verdura' },
  { nome: 'Carote', kcal: 41, proteine: 0.9, carboidrati: 10, grassi: 0.2, categoria: 'verdura', sinonimi: ['carota'] },
  { nome: 'Cipolla', kcal: 40, proteine: 1.1, carboidrati: 9, grassi: 0.1, categoria: 'verdura', sinonimi: ['cipolle'] },
  { nome: 'Cipolla cotta', kcal: 45, proteine: 1, carboidrati: 10, grassi: 0.2, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Porro', kcal: 61, proteine: 1.5, carboidrati: 14, grassi: 0.3, categoria: 'verdura' },
  { nome: 'Aglio', kcal: 149, proteine: 6.4, carboidrati: 33, grassi: 0.5, categoria: 'verdura' },
  { nome: 'Sedano', kcal: 16, proteine: 0.7, carboidrati: 3, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Fagiolini', kcal: 35, proteine: 1.8, carboidrati: 7, grassi: 0.5, categoria: 'verdura', sinonimi: ['fagiolo verde'] },
  { nome: 'Fagiolini cotti', kcal: 35, proteine: 1.8, carboidrati: 7, grassi: 0.5, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Piselli', kcal: 81, proteine: 5.4, carboidrati: 14, grassi: 0.4, categoria: 'verdura' },
  { nome: 'Piselli cotti', kcal: 78, proteine: 5.4, carboidrati: 14, grassi: 0.4, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Patata cruda', kcal: 77, proteine: 2, carboidrati: 17, grassi: 0.1, crudo_cotto: 'crudo', categoria: 'verdura', sinonimi: ['patate'] },
  { nome: 'Patata bollita', kcal: 87, proteine: 1.9, carboidrati: 20, grassi: 0.1, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Patate al forno', kcal: 130, proteine: 2.5, carboidrati: 26, grassi: 1.5, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Patatine fritte', kcal: 312, proteine: 3.4, carboidrati: 41, grassi: 15, categoria: 'verdura', sinonimi: ['french fries', 'fries'] },
  { nome: 'Patate in umido', kcal: 95, proteine: 2, carboidrati: 18, grassi: 1.5, crudo_cotto: 'cotto', categoria: 'verdura' },
  { nome: 'Asparagi', kcal: 20, proteine: 2.2, carboidrati: 3.9, grassi: 0.1, categoria: 'verdura' },
  { nome: 'Funghi champignon', kcal: 22, proteine: 3.1, carboidrati: 3.3, grassi: 0.3, categoria: 'verdura', sinonimi: ['funghi'] },
  { nome: 'Funghi porcini', kcal: 26, proteine: 3.2, carboidrati: 3, grassi: 0.5, categoria: 'verdura' },
  { nome: 'Finocchio', kcal: 31, proteine: 1.2, carboidrati: 7, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Radicchio', kcal: 23, proteine: 1, carboidrati: 4, grassi: 0.3, categoria: 'verdura' },
  { nome: 'Cicoria', kcal: 17, proteine: 0.9, carboidrati: 3, grassi: 0.1, categoria: 'verdura' },
  { nome: 'Carciofi', kcal: 47, proteine: 3.3, carboidrati: 11, grassi: 0.2, categoria: 'verdura', sinonimi: ['carciofo'] },
  { nome: 'Verza', kcal: 28, proteine: 1.8, carboidrati: 5.5, grassi: 0.2, categoria: 'verdura' },
  { nome: 'Bieta', kcal: 19, proteine: 1.8, carboidrati: 3.5, grassi: 0.2, categoria: 'verdura', sinonimi: ['bietola'] },
  { nome: 'Pumpkin / Zucca', kcal: 26, proteine: 1, carboidrati: 6.5, grassi: 0.1, categoria: 'verdura', sinonimi: ['zucca'] },
  { nome: 'Cavolo riccio', kcal: 49, proteine: 4.3, carboidrati: 9, grassi: 0.9, categoria: 'verdura', sinonimi: ['kale', 'cavolo nero'] },
  { nome: 'Pomodoro secco', kcal: 258, proteine: 5, carboidrati: 50, grassi: 3, categoria: 'verdura' },
  { nome: 'Olive nere', kcal: 115, proteine: 0.8, carboidrati: 6, grassi: 11, categoria: 'verdura', sinonimi: ['olive'] },
  { nome: 'Olive verdi', kcal: 115, proteine: 0.8, carboidrati: 6, grassi: 11, categoria: 'verdura' },

  // === LEGUMI ===
  { nome: 'Lenticchie secche', kcal: 296, proteine: 24, carboidrati: 50, grassi: 1, crudo_cotto: 'crudo', categoria: 'legumi' },
  { nome: 'Lenticchie cotte', kcal: 116, proteine: 9, carboidrati: 20, grassi: 0.4, crudo_cotto: 'cotto', categoria: 'legumi' },
  { nome: 'Ceci secchi', kcal: 361, proteine: 19, carboidrati: 61, grassi: 6, crudo_cotto: 'crudo', categoria: 'legumi' },
  { nome: 'Ceci cotti', kcal: 164, proteine: 8.9, carboidrati: 27, grassi: 2.6, crudo_cotto: 'cotto', categoria: 'legumi' },
  { nome: 'Fagioli borlotti secchi', kcal: 310, proteine: 22, carboidrati: 55, grassi: 1.5, crudo_cotto: 'crudo', categoria: 'legumi' },
  { nome: 'Fagioli borlotti cotti', kcal: 127, proteine: 8.7, carboidrati: 22, grassi: 0.5, crudo_cotto: 'cotto', categoria: 'legumi' },
  { nome: 'Fagioli cannellini cotti', kcal: 120, proteine: 8, carboidrati: 21, grassi: 0.5, crudo_cotto: 'cotto', categoria: 'legumi' },
  { nome: 'Fave cotte', kcal: 88, proteine: 7, carboidrati: 14, grassi: 0.4, crudo_cotto: 'cotto', categoria: 'legumi' },
  { nome: 'Soia (fagioli) cotta', kcal: 173, proteine: 17, carboidrati: 9, grassi: 9, categoria: 'legumi' },
  { nome: 'Tofu', kcal: 76, proteine: 8, carboidrati: 1.9, grassi: 4.8, categoria: 'legumi' },
  { nome: 'Edamame', kcal: 121, proteine: 11, carboidrati: 9, grassi: 5, categoria: 'legumi' },
  { nome: 'Hummus', kcal: 166, proteine: 8, carboidrati: 14, grassi: 10, categoria: 'legumi' },
  { nome: 'Ceci in scatola (sgocciolati)', kcal: 100, proteine: 7, carboidrati: 16, grassi: 1.5, categoria: 'legumi' },

  // === FRUTTA ===
  { nome: 'Banana', kcal: 89, proteine: 1.1, carboidrati: 23, grassi: 0.3, categoria: 'frutta', sinonimi: ['banane'] },
  { nome: 'Mela', kcal: 52, proteine: 0.3, carboidrati: 14, grassi: 0.2, categoria: 'frutta', sinonimi: ['mele'] },
  { nome: 'Pera', kcal: 57, proteine: 0.4, carboidrati: 15, grassi: 0.1, categoria: 'frutta', sinonimi: ['pere'] },
  { nome: 'Arancia', kcal: 47, proteine: 0.9, carboidrati: 12, grassi: 0.1, categoria: 'frutta', sinonimi: ['arance'] },
  { nome: 'Mandarino', kcal: 53, proteine: 0.8, carboidrati: 13, grassi: 0.3, categoria: 'frutta', sinonimi: ['mandarini', 'clementine', 'clementino'] },
  { nome: 'Limoncello / Limone', kcal: 29, proteine: 1.1, carboidrati: 9, grassi: 0.3, categoria: 'frutta', sinonimi: ['limone', 'limoni'] },
  { nome: 'Fragole', kcal: 32, proteine: 0.7, carboidrati: 7.7, grassi: 0.3, categoria: 'frutta' },
  { nome: 'Ciliegie', kcal: 63, proteine: 1.1, carboidrati: 16, grassi: 0.2, categoria: 'frutta', sinonimi: ['ciliegia'] },
  { nome: 'Albicocca', kcal: 48, proteine: 1.4, carboidrati: 11, grassi: 0.4, categoria: 'frutta', sinonimi: ['albicocche'] },
  { nome: 'Pesca', kcal: 39, proteine: 0.9, carboidrati: 9.5, grassi: 0.3, categoria: 'frutta', sinonimi: ['pesche'] },
  { nome: 'Nettarina', kcal: 44, proteine: 1.1, carboidrati: 11, grassi: 0.3, categoria: 'frutta' },
  { nome: 'Ananas', kcal: 50, proteine: 0.5, carboidrati: 13, grassi: 0.1, categoria: 'frutta' },
  { nome: 'Kiwi', kcal: 61, proteine: 1.1, carboidrati: 15, grassi: 0.5, categoria: 'frutta' },
  { nome: 'Uva', kcal: 67, proteine: 0.6, carboidrati: 17, grassi: 0.4, categoria: 'frutta', sinonimi: ['acini d\'uva'] },
  { nome: 'Anguria', kcal: 30, proteine: 0.6, carboidrati: 7.6, grassi: 0.2, categoria: 'frutta', sinonimi: ['cocomero'] },
  { nome: 'Melone', kcal: 34, proteine: 0.8, carboidrati: 8, grassi: 0.2, categoria: 'frutta' },
  { nome: 'Mango', kcal: 60, proteine: 0.8, carboidrati: 15, grassi: 0.4, categoria: 'frutta' },
  { nome: 'Papaia', kcal: 43, proteine: 0.5, carboidrati: 11, grassi: 0.3, categoria: 'frutta' },
  { nome: 'Fichi', kcal: 74, proteine: 0.8, carboidrati: 19, grassi: 0.3, categoria: 'frutta', sinonimi: ['fico'] },
  { nome: 'Lampone', kcal: 52, proteine: 1.2, carboidrati: 12, grassi: 0.7, categoria: 'frutta', sinonimi: ['lamponi', 'mirtilli', 'frutti di bosco'] },
  { nome: 'Mirtilli', kcal: 57, proteine: 0.7, carboidrati: 14, grassi: 0.3, categoria: 'frutta' },
  { nome: 'Avocado', kcal: 160, proteine: 2, carboidrati: 9, grassi: 15, categoria: 'frutta' },
  { nome: 'Frutta secca mista', kcal: 600, proteine: 18, carboidrati: 20, grassi: 52, categoria: 'frutta' },
  { nome: 'Datteri', kcal: 282, proteine: 2.5, carboidrati: 75, grassi: 0.4, categoria: 'frutta', sinonimi: ['dattero'] },
  { nome: 'Prugne', kcal: 46, proteine: 0.7, carboidrati: 11, grassi: 0.3, categoria: 'frutta', sinonimi: ['prugna'] },

  // === FRUTTA SECCA E SEMI ===
  { nome: 'Noci', kcal: 654, proteine: 15, carboidrati: 14, grassi: 65, categoria: 'frutta_secca', sinonimi: ['noce'] },
  { nome: 'Mandorle', kcal: 579, proteine: 21, carboidrati: 22, grassi: 50, categoria: 'frutta_secca' },
  { nome: 'Nocciole', kcal: 628, proteine: 15, carboidrati: 17, grassi: 61, categoria: 'frutta_secca', sinonimi: ['nocciola'] },
  { nome: 'Pistacchi', kcal: 562, proteine: 20, carboidrati: 28, grassi: 45, categoria: 'frutta_secca' },
  { nome: 'Anacardi', kcal: 553, proteine: 18, carboidrati: 30, grassi: 44, categoria: 'frutta_secca' },
  { nome: 'Arachidi', kcal: 567, proteine: 26, carboidrati: 16, grassi: 49, categoria: 'frutta_secca', sinonimi: ['noccioline'] },
  { nome: 'Semi di chia', kcal: 486, proteine: 17, carboidrati: 42, grassi: 31, categoria: 'frutta_secca' },
  { nome: 'Semi di lino', kcal: 534, proteine: 18, carboidrati: 29, grassi: 42, categoria: 'frutta_secca' },
  { nome: 'Semi di girasole', kcal: 584, proteine: 21, carboidrati: 20, grassi: 51, categoria: 'frutta_secca' },
  { nome: 'Semi di sesamo', kcal: 573, proteine: 18, carboidrati: 23, grassi: 50, categoria: 'frutta_secca' },
  { nome: 'Burro di arachidi', kcal: 588, proteine: 25, carboidrati: 20, grassi: 50, categoria: 'frutta_secca' },

  // === CONDIMI E SALSE ===
  { nome: 'Olio extravergine di oliva', kcal: 884, proteine: 0, carboidrati: 0, grassi: 100, categoria: 'condimento', sinonimi: ['olio evo', 'olio d\'oliva', 'olio'] },
  { nome: 'Olio di semi', kcal: 884, proteine: 0, carboidrati: 0, grassi: 100, categoria: 'condimento' },
  { nome: 'Burro', kcal: 717, proteine: 0.9, carboidrati: 0.1, grassi: 81, categoria: 'condimento' },
  { nome: 'Margarina', kcal: 717, proteine: 0.2, carboidrati: 0.7, grassi: 81, categoria: 'condimento' },
  { nome: 'Strutto', kcal: 902, proteine: 0, carboidrati: 0, grassi: 100, categoria: 'condimento' },
  { nome: 'Panna fresca', kcal: 340, proteine: 2.5, carboidrati: 3.5, grassi: 35, categoria: 'condimento', sinonimi: ['panna'] },
  { nome: 'Panna light', kcal: 135, proteine: 2.5, carboidrati: 4.5, grassi: 12, categoria: 'condimento' },
  { nome: 'Maionese', kcal: 680, proteine: 1, carboidrati: 0.6, grassi: 75, categoria: 'condimento' },
  { nome: 'Ketchup', kcal: 112, proteine: 1.7, carboidrati: 25, grassi: 0.4, categoria: 'condimento' },
  { nome: 'Senape', kcal: 66, proteine: 4.4, carboidrati: 5.3, grassi: 4, categoria: 'condimento' },
  { nome: 'Salsa di soia', kcal: 53, proteine: 8, carboidrati: 5, grassi: 0.6, categoria: 'condimento', sinonimi: ['soia'] },
  { nome: 'Sugo di pomodoro', kcal: 30, proteine: 1.5, carboidrati: 6, grassi: 0.2, categoria: 'condimento', sinonimi: ['passata', 'passata di pomodoro', 'sugo'] },
  { nome: 'Pesto genovese', kcal: 310, proteine: 7, carboidrati: 8, grassi: 28, categoria: 'condimento', sinonimi: ['pesto'] },
  { nome: 'Besciamella', kcal: 130, proteine: 4, carboidrati: 8, grassi: 9, categoria: 'condimento', sinonimi: ['besciamella'] },
  { nome: 'Miele', kcal: 304, proteine: 0.3, carboidrati: 82, grassi: 0, categoria: 'condimento' },
  { nome: 'Zucchero', kcal: 387, proteine: 0, carboidrati: 100, grassi: 0, categoria: 'condimento', sinonimi: ['saccarosio'] },
  { nome: 'Aceto balsamico', kcal: 88, proteine: 0.5, carboidrati: 17, grassi: 0, categoria: 'condimento' },
  { nome: 'Salsa barbecue', kcal: 172, proteine: 0.8, carboidrati: 41, grassi: 0.6, categoria: 'condimento', sinonimi: ['bbq'] },

  // === DOLCI E SNACK ===
  { nome: 'Cioccolato fondente', kcal: 546, proteine: 4.9, carboidrati: 61, grassi: 31, categoria: 'dolce', sinonimi: ['cioccolato'] },
  { nome: 'Cioccolato al latte', kcal: 535, proteine: 7.7, carboidrati: 59, grassi: 30, categoria: 'dolce' },
  { nome: 'Cioccolato bianco', kcal: 539, proteine: 5.9, carboidrati: 59, grassi: 32, categoria: 'dolce' },
  { nome: 'Biscotti secchi', kcal: 430, proteine: 8, carboidrati: 70, grassi: 14, categoria: 'dolce', sinonimi: ['biscotto'] },
  { nome: 'Biscotti al cioccolato', kcal: 490, proteine: 6, carboidrati: 65, grassi: 23, categoria: 'dolce' },
  { nome: 'Crostatina', kcal: 380, proteine: 5, carboidrati: 55, grassi: 16, categoria: 'dolce' },
  { nome: 'Croissant', kcal: 406, proteine: 8, carboidrati: 46, grassi: 21, categoria: 'dolce', sinonimi: ['cornetto'] },
  { nome: 'Ciambella', kcal: 380, proteine: 6, carboidrati: 58, grassi: 15, categoria: 'dolce', sinonimi: ['donut', 'ciambella'] },
  { nome: 'Gelato alla vaniglia', kcal: 207, proteine: 3.5, carboidrati: 24, grassi: 11, categoria: 'dolce', sinonimi: ['gelato'] },
  { nome: 'Sorbetto al limone', kcal: 130, proteine: 0.5, carboidrati: 32, grassi: 0.2, categoria: 'dolce' },
  { nome: 'Merendina', kcal: 388, proteine: 5, carboidrati: 56, grassi: 16, categoria: 'dolce' },
  { nome: 'Patatine in sacchetto', kcal: 536, proteine: 7, carboidrati: 53, grassi: 33, categoria: 'snack', sinonimi: ['chips', 'patatine'] },
  { nome: 'Popcorn', kcal: 387, proteine: 12, carboidrati: 78, grassi: 4, categoria: 'snack' },
  { nome: 'Crackers salati', kcal: 430, proteine: 10, carboidrati: 75, grassi: 12, categoria: 'snack' },

  // === BEVANDE ===
  { nome: 'Acqua', kcal: 0, proteine: 0, carboidrati: 0, grassi: 0, categoria: 'bevanda' },
  { nome: 'Coca cola', kcal: 42, proteine: 0, carboidrati: 10.6, grassi: 0, categoria: 'bevanda', sinonimi: ['coca', 'cola'] },
  { nome: 'Coca zero', kcal: 0, proteine: 0, carboidrati: 0, grassi: 0, categoria: 'bevanda' },
  { nome: 'Aranciata', kcal: 46, proteine: 0, carboidrati: 11.5, grassi: 0, categoria: 'bevanda' },
  { nome: 'Birra normale', kcal: 43, proteine: 0.5, carboidrati: 3.6, grassi: 0, categoria: 'bevanda', sinonimi: ['birra'] },
  { nome: 'Birra artigianale', kcal: 60, proteine: 0.5, carboidrati: 5, grassi: 0, categoria: 'bevanda' },
  { nome: 'Vino rosso', kcal: 85, proteine: 0.1, carboidrati: 2.6, grassi: 0, categoria: 'bevanda', sinonimi: ['vino'] },
  { nome: 'Vino bianco', kcal: 82, proteine: 0.1, carboidrati: 2.6, grassi: 0, categoria: 'bevanda' },
  { nome: 'Spritz', kcal: 80, proteine: 0, carboidrati: 8, grassi: 0, categoria: 'bevanda', sinonimi: ['aperol spritz'] },
  { nome: 'Caffè espresso', kcal: 2, proteine: 0.1, carboidrati: 0, grassi: 0, categoria: 'bevanda', sinonimi: ['caffè', 'caffe'] },
  { nome: 'Cappuccino', kcal: 45, proteine: 2.5, carboidrati: 4, grassi: 2.5, categoria: 'bevanda' },
  { nome: 'Latte macchiato', kcal: 50, proteine: 3, carboidrati: 5, grassi: 2.5, categoria: 'bevanda' },
  { nome: 'Tè verde', kcal: 1, proteine: 0, carboidrati: 0, grassi: 0, categoria: 'bevanda', sinonimi: ['the verde'] },
  { nome: 'Succo d\'arancia', kcal: 45, proteine: 0.7, carboidrati: 10, grassi: 0.2, categoria: 'bevanda' },
  { nome: 'Smoothie frutta', kcal: 60, proteine: 0.8, carboidrati: 14, grassi: 0.3, categoria: 'bevanda' },

  // === INTEGRATORI ===
  { nome: 'Whey protein (dose 30g)', kcal: 120, proteine: 24, carboidrati: 3, grassi: 1.5, categoria: 'integratore', sinonimi: ['proteine in polvere', 'whey'] },
  { nome: 'Barretta proteica', kcal: 360, proteine: 30, carboidrati: 35, grassi: 12, categoria: 'integratore', sinonimi: ['barretta'] },
  { nome: 'Creatina (dose 5g)', kcal: 0, proteine: 0, carboidrati: 0, grassi: 0, categoria: 'integratore' },

  // === SPEZIE/AROMI (valori trascurabili ma presenti) ===
  { nome: 'Basilico', kcal: 23, proteine: 3.1, carboidrati: 2.7, grassi: 0.6, categoria: 'erbe' },
  { nome: 'Prezzemolo', kcal: 36, proteine: 3, carboidrati: 6.3, grassi: 0.8, categoria: 'erbe' },
  { nome: 'Rosmarino', kcal: 131, proteine: 3.3, carboidrati: 21, grassi: 5.9, categoria: 'erbe' },
  { nome: 'Origano', kcal: 306, proteine: 9, carboidrati: 64, grassi: 4.1, categoria: 'erbe' },
  { nome: 'Pepe nero', kcal: 251, proteine: 10, carboidrati: 64, grassi: 3, categoria: 'erbe', sinonimi: ['pepe'] },
  { nome: 'Sale', kcal: 0, proteine: 0, carboidrati: 0, grassi: 0, categoria: 'erbe', sinonimi: ['sale grosso'] },
];

export function searchFoods(query: string): FoodDB[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DB.slice(0, 12);
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = FOOD_DB.map((f) => {
    const name = f.nome.toLowerCase();
    const syns = (f.sinonimi ?? []).map((s) => s.toLowerCase());
    let score = 0;
    if (name === q) score += 100;
    if (name.startsWith(q)) score += 50;
    if (name.includes(q)) score += 20;
    for (const s of syns) {
      if (s === q) score += 90;
      if (s.startsWith(q)) score += 40;
      if (s.includes(q)) score += 15;
    }
    // partial multi-word match
    for (const t of terms) {
      if (name.includes(t)) score += 5;
      if (syns.some((s) => s.includes(t))) score += 4;
    }
    return { f, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((s) => s.f);
}

export function calcFoodValues(food: FoodDB, grammi: number) {
  const f = grammi / 100;
  return {
    kcal: Math.round(food.kcal * f),
    proteine: Math.round(food.proteine * f * 10) / 10,
    carboidrati: Math.round(food.carboidrati * f * 10) / 10,
    grassi: Math.round(food.grassi * f * 10) / 10,
  };
}
