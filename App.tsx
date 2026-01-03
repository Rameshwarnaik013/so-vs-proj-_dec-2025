
import React, { useState, useMemo, useRef } from 'react';
import { parseCSV, downloadAsCSV } from './utils';
import { InventoryRecord, FilterState } from './types';
import Sidebar from './components/Sidebar';
import { Icons } from './constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell,
  LabelList
} from 'recharts';

const RAW_CSV = `Month,Year,Item Code,item_parent,Item_Name,Item Type,Item Group,Projection,SO Qty,Internal Qty,Dispatch,Proj. - SO,Fill Rate,SO VS Proj.,SO VS Projection percentage
December,2025,Makhana_7-30169,Makhana Value Added,Makha Shaka Imli Waves Farmley Pillow Pouch 25g- Ladi Makhana,,Munchies,0,129,0,0,-129,0,,#DIV/0!
December,2025,Makhana_7-30170,Makhana Value Added,Makha Shaka Cheese Waves Farmley Pillow Pouch 25 g- Ladi,,Munchies,0,120,0,0,-120,0,,#DIV/0!
December,2025,Pistachio_8-3057,Califorian Pistachios,Farmley Premium California Roasted & Salted Pistachios standee pouch 250 gm,,Pistachio,375,0,0,0,375,NaN,0,0.00%
December,2025,Almonds_1-1748,Premium California Almonds,Premium California Almonds Farmley Standee Pouch 500 g,KVI,Almonds,8270,16815.5,48,14463.5,-8546,0.860129048,2.033436121,203.33%
December,2025,Almonds_1-1750,Popular California Almonds,Popular California Almonds Farmley Standee Pouch 500 g,KVI,Almonds,9329,5380,0,4295.5,3949,0.798420074,0.576696323,57.67%
December,2025,Almonds_1-194,Popular California Almonds,Popular California Almonds Farmley Standee Pouch 250 g,KVI,Almonds,839,420.25,0,378.25,419,0.900059488,0.500744713,50.09%
December,2025,Almonds_1-196,Popular California Almonds,Popular California Almonds Farmley Standee Pouch 1 kg,KVI,Almonds,7793,10760,8,10080,-2967,0.936802974,1.380726293,138.07%
December,2025,Almonds_1-1991,Premium California Almonds,Premium California Almonds Farmley Standee Pouch 1 Kg,KVI,Almonds,2075,336,0,272,1739,0.80952381,0.161927711,16.19%
December,2025,Almonds_1-1992,Premium California Almonds,Premium California Almonds Farmley Standee Pouch 250 g,KVI,Almonds,2897,2626.25,0,2543,270.25,0.968300809,0.906697739,90.65%
December,2025,Almonds_1-2933,Popular California Almonds,Popular Almond Farmley Standee Pouch 60g,KVI,Almonds,29,54.6,0,54.6,-25.32,1,1.864754098,188.28%
December,2025,Apricot_2-2540,Premium Turkish Dried Apricot,Premium Turkish Dried Apricot Farmley Standee Pouch 200 g,KVI,Apricots,5696,4614,150,2508,1082.4,0.543563069,0.809985254,81.00%
December,2025,Cashewnut_3-1735,Premium W240 cashew,Premium W240 cashew Farmley Vacuum Standee Pouch 250 g,KVI,Cashew,192,100,0,80,91.5,0.8,0.522193211,52.08%
December,2025,Cashewnut_3-1736,Premium W320 Cashew,Premium W320 Cashew Farmley Vacuum Standee Pouch 250 g,KVI,Cashew,4357,2932.35,80,2911.6,1424.9,0.992923764,0.672981812,67.30%
December,2025,Cashewnut_3-1987,Premium W320 Cashew,Premium W320 Cashew Farmley Standee Pouch 500 g,KVI,Cashew,10370,17411.5,17180,15121.5,-7041.5,0.86847773,1.679026037,167.90%
December,2025,Cashewnut_3-1988,Premium W320 Cashew,Premium W320 Cashew Farmley Standee Pouch 1 Kg,KVI,Cashew,3837,380,1260,350,3457,0.921052632,0.099035705,9.90%
December,2025,Cashewnut_3-2430,Popular W400 Cashew,Popular W400 Cashew Farmley Generic Pouch 1 kg - Pack of 2 (500 g Each),KVI,Cashew,1290,240,0,240,1050,1,0.186046512,18.60%
December,2025,Cashewnut_3-2955,Popular W400 Cashew,Popular Cashewnuts Farmley Standee Pouch 50g,KVI,Cashew,38,52.5,0,52.5,-14.05,1,1.365409623,138.16%
December,2025,Cashewnut_3-447,Popular W400 Cashew,Popular W400 Cashew Farmley Generic Pouch 500 g,KVI,Cashew,11271,7380,0,7000,3890.5,0.948509485,0.654806797,65.48%
December,2025,Dates_04-2878,Premium Omani Fard Dates,Premium Omani Fard Dates Farmley Standee Pouch 35 g,KVI,Dates,2275,2766.05,0,2278.5,-491.05,0.823737821,1.215846154,121.58%
December,2025,Dates_04-30039,Premium Barkat Dates,Barkat Dates Farmley Standee Pouch 1 kg -Pack of 2 (500 g each),KVI,Dates,10346,8424,0,6948,1922,0.824786325,0.814227721,81.42%
December,2025,Dates_4-20165,Premium Omani Fard Dates,Premium Omani Fard Dates Farmley standee pouch 500 g,KVI,Dates,4750,2484,0,2484,2266,1,0.522947368,52.29%
December,2025,Dates_4-2469,Premium Omani Fard Dates,Premium Omani Fard Dates Farmley standee pouch 400 g,KVI,Dates,40923,51007.2,8287.6,43125.2,-10084,0.845472796,1.246412793,124.64%
December,2025,Dates_4-2472,Barkat Dates Vendor Corrugated Box 10 kg,Barkat Dates Farmley Standee Pouch 500g,KVI,Dates,118,2799,2943,1557,-2681.5,0.556270096,23.8212766,2372.03%
December,2025,Dates_4-2854,Premium Omani Fard Dates,Premium Omani Fard Dates Farmley Standee Pouch 800 g - Pack of 2 (400g each),KVI,Dates,758,4161.6,0,964.8,-3404,0.23183391,5.49313622,549.02%
December,2025,Dates_4-3011,Premium Barkat Dates,Barkat dates Farmley Standee Pouch 250 g,KVI,Dates,2997,1800,720,1792.5,1197.25,0.995833333,0.600550505,60.06%
December,2025,Dates_4-3012,Kalmi Dates Vendor Corrugated Box 6 kg,Kalmi Dates Farmley Standee Pouch 200 gms,KVI,Dates,1749,5016,1062,0,-3267.4,0,2.868580579,286.79%
December,2025,Dried Fruits_5-2543,Premium California Sliced Cranberries - Ocean Spray,Premium California Whole Dried Cranberries Farmley Standee Pouch 200 g,KVI,Cranberries,9971,9042.6,4332,7890.6,928.2,0.872603012,0.906908172,90.69%
December,2025,Dried Fruits_5-2552,Premium Dried Mango Sliced,Premium Dried Mango Farmley Standee Pouch 200 g,KVI,Exotics & Berries,27,6,0,6,20.8,1,0.223880597,22.22%
December,2025,Dried Fruits_5-2553,Premium Dried Strawberry,Premium Dried Strawberry Farmley Standee Pouch 200 g,KVI,Exotics & Berries,71,0,0,0,71.2,NaN,0,0.00%
December,2025,Dried Fruits_5-2568,Premium California Dried Blueberries - Graceland,Premium Dried Blueberries Farmley Standee Pouch 200 g,KVI,Exotics & Berries,190,0,0,0,189.6,NaN,0,0.00%
December,2025,Dried Fruits_5-2682,Premium California Sliced Cranberries - Ocean Spray,Premium Dried Cranberries Farmley Standee Pouch - Pack of 2 (200g each),KVI,Cranberries,244,90,0,78,154,0.866666667,0.368852459,36.89%
December,2025,Dried Fruits_5-30133,Premium California Sliced Cranberries - Ocean Spray,Cranberry Farmley Pillow Pouch 18g- Zepto,KVI,Cranberries,1080,1080,0,872.64,2.27E-13,0.808,1,100.00%
December,2025,Dry Fruit Mix_15-2720,Dry Fruit Combo,"Farmley Dry Fruits Combo - Popular California Almonds, W400 Cashews (500 g Each)",KVI,Others,368,60,0,12,308,0.2,0.163043478,16.30%
December,2025,Fig_6-2464,Premium Anjeer,Premium Anjeer Farmley Standee Pouch 200 g,KVI,Figs,8432,7644,36,6672,788.2,0.872841444,0.906524988,90.65%
December,2025,Fig_6-2680,Selecta Afghan Figs,Premium Figs Farmley Standee Pouch 400 g - Pack of 2 (200 g each),KVI,Figs,189,210,0,210,-21.2,1,1.112288136,111.11%
December,2025,Fig_6-2696,Premium Anjeer,Premium Anjeer Farmley Standee Pouch 250 g,KVI,Figs,1869,195,0,195,1673.75,1,0.104347826,10.43%
December,2025,Makhana_7-2021,Prasadam Retail Makhana,Prasadam Makhana Center Seal Pouch 200 g,KVI,Makhana Raw,0,3,0.8,0,-3,0,,#DIV/0!
December,2025,Makhana_7-2768,Prasadam Retail Makhana,Prasadam Makhana Farmley Center Seal Pouch 200g E/US,KVI,Makhana Raw,280,0,0,0,280,NaN,0,0.00%
December,2025,Makhana_7-30042,Prasadam Retail Makhana,Prasadam Makhana Farmley Center Seal Pouch 250g,KVI,Makhana Raw,2150,0,0,0,2149.5,NaN,0,0.00%
December,2025,Makhana_7-30096,Prasadam Retail Makhana,Prasadam Makhana Center Seal Pouch 100 g- NEW,KVI,Makhana Raw,10337,9480,3914.9,9360,857.3,0.987341772,0.917067319,91.71%
December,2025,Makhana_7-30097,Prasadam Retail Makhana,Prasadam Makhana Farmley Center Seal Pouch 60g-New,KVI,Makhana Raw,898,981,337.56,927,-82.98,0.944954128,1.092403287,109.24%
December,2025,Makhana_7-30098,Prasadam Retail Makhana,Prasadam Makhana Center Seal Pouch 200 g- NEW,KVI,Makhana Raw,14375,9811,5429.6,9635,4564.4,0.982060952,0.682485357,68.25%
December,2025,Raisins_10-1738,Premium Raisin Long,Premium Raisin Long Farmley Standee Pouch 200 g,KVI,Raisins,9730,9277.2,0,8976.4,452.8,0.967576424,0.953463515,95.35%
December,2025,Raisins_10-1989,Premium Raisin Long,Premium Raisin Long Farmley Standee Pouch 1 kg,KVI,Raisins,9463,5064,8,4952,4399,0.977883096,0.535136849,53.51%
December,2025,Raisins_10-1990,Premium Raisin Long,Premium Raisin Long Farmley Standee Pouch 500 g,KVI,Raisins,16955,6453,54,5562,10501.5,0.861924686,0.380606919,38.06%
December,2025,Raisins_10-2382,Premium Munakka,Premium Munakka Farmley Standee Pouch 200 g,KVI,Raisins,1135,912,42,0,223.2,0,0.803382664,80.35%
December,2025,Seeds_11-20155,Premium Watermelon Seeds,Premium Watermelon Seeds Farmley Standee Pouch 100 gms,KVI,Other Seeds,250,161,0,7,89,0.043478261,0.644,64.40%
December,2025,Seeds_11-2541,Premium Chia Seeds,Premium Chia Seeds Farmley Standee Pouch 200 g,KVI,Chia Seeds,47772,22656,2670,20913,25116,0.923066737,0.4742527,47.43%
December,2025,Seeds_11-2542,Premium Jumbo Pumpkin Seeds,Premium Jumbo Pumpkin Seeds Farmley Standee Pouch 200 g,KVI,Other Seeds,20997,18465.6,1284,16872.6,2531.2,0.913731479,0.879448297,87.94%
December,2025,Seeds_11-2549,Premium Sunflower Seeds,Premium Sunflower Seeds Farmley Standee Pouch 200 g,KVI,Other Seeds,11014,10095.6,396,9360.6,918.4,0.927196006,0.916615217,91.66%
December,2025,Seeds_11-2550,Premium Flax Seeds,Premium Flax Seeds Farmley Standee Pouch 200 g,KVI,Other Seeds,9149,11115.6,582,10296.6,-1966.4,0.926319767,1.214925895,121.50%
December,2025,Seeds_11-2610,Premium Sunflower Seeds,Premium Sunflower Seeds Farmley Standee Pouch 400 g - Pack of 2 (200 g each),KVI,Other Seeds,1540,0,0,0,1540,NaN,0,0.00%
December,2025,Seeds_11-2675,Seeds Combo,"Farmley Seeds Combo - Chia Seeds, Flax Seeds, Pumpkin Seeds, Sunflower Seeds Farmley Standee Pouch 800 g (200 g Each)",KVI,Other Seeds,17533,6732.8,0,6074.4,10800,0.902210076,0.384011681,38.40%
December,2025,Seeds_11-2676,Premium Chia Seeds,Premium Chia Seeds Farmley Standee Pouch - Pack of 5 (200g each),KVI,Chia Seeds,754,408,0,408,346,1,0.541114058,54.11%
December,2025,Seeds_11-2693,Premium Chia Seeds,Premium Chia Seeds Farmley Jar 1 Kg,KVI,Chia Seeds,11379,6852,0,5676,4527,0.828371278,0.602161877,60.22%
December,2025,Seeds_11-2838,Premium Chia Seeds,Chia Seeds Farmley Jar 300g,KVI,Chia Seeds,990,0,0,0,990,NaN,0,0.00%
December,2025,Seeds_11-2841,Premium Flax Seeds,Flax Seeds Farmley Jar 325g - E/US,KVI,Other Seeds,117,0,0,0,117,NaN,0,0.00%
December,2025,Seeds_11-2843,Premium Pumpkin Seeds,Pumpkin Seeds Farmley Jar 325g - E/US,KVI,Other Seeds,234,0,0,0,234,NaN,0,0.00%
December,2025,Seeds_11-2867,Premium Quinoa seeds,Quinoa seeds Farmley Jar 1kg,KVI,Other Seeds,13210,8064,0,7500,5146,0.930059524,0.610446631,61.04%
December,2025,Seeds_11-2868,Premium Quinoa seeds,Quinoa seeds Farmley Standee Pouch 500g,KVI,Other Seeds,13233,11230.5,0,9855,2002.5,0.877521036,0.84867377,84.87%
December,2025,Seeds_11-2932,Basil Seeds,Basil Seeds Farmley Standee pouch 300g,KVI,Other Seeds,3440,1890,90,1800,1550.4,0.952380952,0.549354726,54.94%
December,2025,Seeds_11-2937,Premium Chia Seeds,Chia Seeds Farmley Standee Pouch 120 g,KVI,Chia Seeds,236,0,0,0,235.8,NaN,0,0.00%
December,2025,Seeds_11-2939,Roasted Flax Seeds,Roasted Flax Seeds Farmley Standee Pouch 150g,KVI,Other Seeds,207,168,0,168,39,1,0.811594203,81.16%
December,2025,Seeds_11-2953,Premium Watermelon Seeds,Watermelon Seeds Farmley Standee Pouch 500g,KVI,Other Seeds,2519,2160,4.5,1672,358.5,0.774074074,0.857653365,85.75%
December,2025,Seeds_11-2954,Premium Chia Seeds,Chia Seed Farmley Standee Pouch 500g,KVI,Chia Seeds,3229,2472,1936,2456,757,0.993527508,0.765562094,76.56%
December,2025,Seeds_11-3071,Premium Sunflower Seeds,Sunflower Seeds Farmley Jar 250g - E/US,KVI,Other Seeds,270,0,0,0,270,NaN,0,0.00%
December,2025,Walnut_12-1535,Premium Broken Walnut Kernels,Premium Broken Walnut Kernels Farmley Standee Pouch 200 g,KVI,Walnut,10925,11179.8,715.4,9547.8,-254.4,0.854022433,1.023285189,102.33%
December,2025,Walnut_12-2655,Premium Extra Light Halves Walnut Kernels,Premium Extra Light Halves Walnut Kernels Farmley Standee Pouch 200 g,KVI,Walnut,3422,1185.8,417.6,1176.2,2236,0.9919042,0.346542755,34.65%
December,2025,Walnut_15-2922,Premium Broken Walnut Kernels,Premium Broken Walnut Kernels Farmley Standee Pouch 250 g,KVI,Walnut,1875,2004,0,1380,-129,0.688622754,1.0688,106.88%
December,2025,Almonds_1-2653,Roasted and Salted Almonds,Roasted & Salted Almonds Farmley Standee Pouch 40 g,Value Added,Roasted Almonds,54,44.8,0,42,9.68,0.9375,0.822320117,82.96%
December,2025,Almonds_1-2654,Roasted and Salted Almonds,Roasted & Salted Almonds Farmley Standee Pouch 200 g,Value Added,Roasted Almonds,870,888.6,90,810.6,-18.2,0.912221472,1.020909926,102.14%
December,2025,Almonds_1-30095,Roasted Almonds,Smokey Almond Farmley Tin Jar 50g - Institutional,Value Added,Roasted Almonds,4250,1602.2,0,1472,2647.8,0.918736737,0.376988235,37.70%
December,2025,Cashewnut_3-2470,Roasted Thai Chilli Cashew,Roasted Thai Chilli Cashew - Farmley Standee Pouch 200 g,Value Added,Roasted & Flavoured Cashew,25,30,0,30,-4.8,1,1.19047619,120.00%
December,2025,Cashewnut_3-2471,Roasted Black Pepper Cashew,Roasted Black Pepper Cashew - Farmley Standee Pouch 200 g,Value Added,Roasted & Flavoured Cashew,39,150,84,0,-111,0,3.846153846,384.62%
December,2025,Cashewnut_3-2472,Roasted and Salted Cashew,Roasted and Salted Cashew - Farmley Standee Pouch 200 g,Value Added,Roasted & Flavoured Cashew,874,1230.8,18,1056.8,-356.8,0.858628534,1.408237986,140.82%
December,2025,Cashewnut_3-2852,Roasted and Salted Cashew,Roasted & Salted Cashews Farmley Monocarton 50g - Institutional,Value Added,Roasted & Flavoured Cashew,2250,2045.9,0,1357.1,204.1,0.663326653,0.909288889,90.93%
December,2025,Cashewnut_3-2973,Roasted and Salted Cashew,Roasted & Salted Cashew - Farmley Standee Pouch 36 g - Retail,Value Added,Roasted & Flavoured Cashew,796,352.8,0.036,317.52,442.908,0.9,0.443378727,44.32%
December,2025,Cashewnut_3-2974,Cashew,Roasted Thai Chilli Cashew - Farmley Standee Pouch 36 g - Retail,Value Added,Roasted & Flavoured Cashew,116,45.36,0,32.76,70.524,0.722222222,0.391425909,39.10%
December,2025,Cashewnut_3-2975,Roasted Black Pepper Cashew,Roasted Black Pepper Cashew - Farmley Standee Pouch 36 g - Retail,Value Added,Roasted & Flavoured Cashew,326,186.48,0,153.72,139.968,0.824324324,0.571239524,57.20%
December,2025,Cashewnut_3-2976,Roasted Black Pepper Cashew,Roasted Black Pepper Cashew - Farmley Standee Pouch 150 g - Retail,Value Added,Roasted & Flavoured Cashew,1114,882,0.45,0,232.05,0,0.791705938,79.17%
December,2025,Cashewnut_3-2977,Roasted Thai Chilli Cashew,Roasted Thai Chilli Cashew - Farmley Standee Pouch 150 g,Value Added,Roasted & Flavoured Cashew,613,945,0.6,36,-332.1,0.038095238,1.54185022,154.16%
December,2025,Cashewnut_3-2978,Roasted and Salted Cashew,Roasted & Salted Cashew - Farmley Standee Pouch 150 g,Value Added,Roasted & Flavoured Cashew,2229,1449.45,0,1372.95,779.25,0.94722136,0.65035671,65.03%
December,2025,Cashewnut_3-3094,Roasted & Flavoured Cashew,Salted Cashews Farmley Tin Jar 50g - Institutional,Value Added,Roasted & Flavoured Cashew,9000,7225.2,0,5682.15,1774.8,0.786434978,0.8028,80.28%
December,2025,Dates_04-30053,Dark Choco-Orange Date Bites,Dark Choco-Orange Date Bites Monocarton 240 g - Pack of 12 (20 g Each),Value Added,Healthy Desserts,0,1.92,0,0,-1.92,0,,#DIV/0!
December,2025,Dates_04-30057,Apple Pie Date Bites,Apple Pie Date Bite Farmley Tin Jar 200g,Value Added,Healthy Desserts,4322,2320,86.4,2291.2,2002.2,0.987586207,0.536763685,53.68%
December,2025,Dates_04-30567,Apple Pie Date Bites,Apple Pie Date Bites Farmley Monocarton 240 g - Pack of 12 (20 g Each),Value Added,Healthy Desserts,1800,1128.96,0,1098.24,671.04,0.972789116,0.6272,62.72%
December,2025,Dates_15-30087,Classic Date bites,Classic Date Bites Farmley Monocarton 160 g- Pack of 8 (20 g Each),Value Added,Healthy Desserts,1200,88.32,0,88.32,1111.68,1,0.0736,7.36%
December,2025,Dates_15-30089,Classic Date bites,Apple Pie Date Bites Farmley Monocarton 160 g- Pack of 8 (20 g Each),Value Added,Healthy Desserts,327,34.56,0,30.72,292.64,0.888888889,0.105623472,10.57%
December,2025,Dates_15-30090,Classic Date bites,"Assorted Pack Farmley 360g Monocarton- Dark Choco Orange Date Bite 120 g, Classic Date Bite 120g, Apple Pie Date Bite 120g Pack of 18 (20 g)",Value Added,Healthy Desserts,322,0,0,0,322.2,NaN,0,0.00%
December,2025,Dates_15-30103,Classic Date bites,"Assorted Pack Farmley 360g Monocarton- Dark Choco Orange Date Bite 120 g, Classic Date Bite 120g, Apple Pie Date Bite 120g Pack of 18 (20 g)",Value Added,Healthy Desserts,973,622.08,0,622.08,351,1,0.639289678,63.93%
December,2025,Dates_15-30109,Dark Choco-Orange Date Bites,Classic Date Bites Farmley Sachet 20 g - Single Serve,Value Added,Healthy Desserts,7395,7752.96,0,7505.52,-358.24,0.968084448,1.048445377,104.84%
December,2025,Dates_15-30110,Dark Choco-Orange Date Bites,Dark Choco Orange Date Bites Farmley Sachet 20 g - Single Serve,Value Added,Healthy Desserts,1774,1653.12,0,1587.84,121.06,0.960511034,0.931765661,93.19%
December,2025,Dates_15-30111,Dark Choco-Orange Date Bites,Apple Pie Date Bite Farmley sachet 20 g - Single serve,Value Added,Healthy Desserts,678,622.08,0,589.44,56.12,0.947530864,0.917251548,91.75%
December,2025,Dates_15-30144,Date Bite Corrugated Box 10 kg,"Assorted Pack Farmley 60g Dark Choco Orange Date Bite 20g, Classic Date Bite 20g, Apple Pie Date Bite 20g",Value Added,Healthy Desserts,3241,868.5,0,823.5,2372.4,0.948186528,0.267981116,26.80%
December,2025,Dates_4-20161,Coffee Rush Date Bites,Coffee Rush Date Bite Farmley Sachet 20g- Single Serve,Value Added,Healthy Desserts,340,860.96,46.08,824.48,-520.96,0.957628694,2.532235294,253.22%
December,2025,Dates_4-20162,Coffee Rush Date Bites,Coffee Rush Date Bite Farmley Tin Jar 200g,Value Added,Healthy Desserts,2408,3011,62.4,2958.2,-603,0.982464298,1.250415282,125.04%
December,2025,Dates_4-20166,Date Melts,Date Melts Farmley Standee pouch 100g,Value Added,Healthy Desserts,0,0.3,0,0.3,-0.3,1,,#DIV/0!
December,2025,Dates_4-20167,Dark Choco-Orange Date Bites,Dark Choco Orange Date Bite Farmley Tin Jar 200 g- Global,Value Added,Healthy Desserts,72,0,0,0,72,NaN,0,0.00%
December,2025,Dates_4-20168,Classic Date bites,Classic Date Bite Farmley Tin Jar 200 g- Global,Value Added,Healthy Desserts,120,0,0,0,120,NaN,0,0.00%
December,2025,Dates_4-20171,Coffee Rush Date Bites,Coffee Rush Date Bite Farmley Mono Carton Farmley 240 g - Pack of 12 (20 g Each),Value Added,Healthy Desserts,0,2017.44,0,1922.4,-2017.44,0.952890792,,#DIV/0!
December,2025,Dates_4-2566,Date Bite Corrugated Box 10 kg,Classic Date Bites Farmley Monocarton 240 g - Pack of 12 (20 g Each),Value Added,Healthy Desserts,3227,5158.08,0,5054.4,-1931.04,0.979899497,1.598393574,159.84%
December,2025,Dates_4-2931,Date Powder,Date Powder Farmley Standee pouch 200 g,Value Added,Dates,4624,6990,192,5820,-2366,0.832618026,1.511678201,151.17%
December,2025,Dates_4-30101,Dark Choco-Orange Date Bites,Dark Choco-Orange Date Bite Farmley Tin Jar 200g,Value Added,Healthy Desserts,7355,3222.4,177.6,2790.4,4133,0.865938431,0.438099899,43.81%
December,2025,Dates_4-30105,Date Bite Corrugated Box 10 kg,"Assorted Pack Farmley 60g Dark Choco Orange Date Bite 20g, Classic Date Bite 20g, Apple Pie Date Bite 20g",Value Added,Healthy Desserts,36,0,0,0,36,NaN,0,0.00%
December,2025,Dates_4-30106,Dark Choco-Orange Date Bites,Dark Choco-Orange Date Bites Monocarton 240 g - Pack of 12 (20 g Each),Value Added,Healthy Desserts,1920,1059.84,0,1029.12,860.16,0.971014493,0.552,55.20%
December,2025,Dates_4-30107,Classic Date bites,Dark Choco-Orange Date Bites Farmley Monocarton 160 g- Pack of 8 (20 g Each),Value Added,Healthy Desserts,249,42.24,0,42.24,206.56,1,0.16977492,16.96%
December,2025,Dates_4-30131,Date Bite Corrugated Box 10 kg,Date Bites Farmley Jar 400g- Pack of 2 (200g each),Value Added,Healthy Desserts,148,144,0,144,3.6,1,0.975609756,97.30%
December,2025,Dates_4-3048,Dark Choco-Orange Date Bites,Dark Choco-Orange Date Bite Farmley Tin Jar 200g,Value Added,Healthy Desserts,614,0,0,0,614.4,NaN,0,0.00%
December,2025,Dates_4-30567,Date Bite Corrugated Box 10 kg,Classic Date Bites Farmley Tin Jar 200 g,Value Added,Healthy Desserts,30286,13899,153.6,13174.2,16386.8,0.947852363,0.458927946,45.89%
December,2025,Dates_4-30569,Dark Choco-Orange Date Bites,Dark Choco-Orange Date Bites Monocarton 240 g - Pack of 12 (20 g Each) - With EAN,Value Added,Healthy Desserts,6,0,0,0,5.76,NaN,0,0.00%
December,2025,Dates_4-30570,Classic Date bites,Classic Date Bites Farmley Monocarton 240 g - Pack of 12 (20 g Each) - With EAN,Value Added,Healthy Desserts,888,0,1002.24,0,888.24,NaN,0,0.00%
December,2025,Dates_4-3059,Date Bite Corrugated Box 10 kg,Date Bites Sample Pack 500 g Farmley Standee Pouch (5g Each),Value Added,Healthy Desserts,0,26,0,26,-26,1,,#DIV/0!
December,2025,Dates_4-3068,Date Bite Corrugated Box 10 kg,Classic Date Bites Farmley Tray 240 g-20 g (Pack of 12)- Gifting,Value Added,Healthy Desserts,122,0,0,0,122.16,NaN,0,0.00%
December,2025,Dried Fruits_5-30134,Premium California Sliced Cranberries - Ocean Spray,Masala Cranberry Farmley Pillow Pack 18g- single serve,Value Added,Cranberries,63,30.24,0,0,32.76,0,0.48,48.00%
December,2025,Dry Fruit Mix_15-2296,Premium Panchmewa Superfood,Premium Panchmewa Superfood Farmley Jar 450 g,Value Added,Trail Mixes,0,1.35,0,1.35,-1.35,1,,#DIV/0!
December,2025,Dry Fruit Mix_15-2402,Trail Mix,Trail Mix Farmley Standee Pouch 200 g,Value Added,Trail Mixes,8533,10443.2,3972,9738.2,-1910.4,0.932491956,1.223888993,122.39%
December,2025,Dry Fruit Mix_15-2403,Seed Mix,Seed Mix Farmley Standee Pouch 200 g,Value Added,Seed Mix,16564,12789.2,6060,11988.2,3774.6,0.93736903,0.772117509,77.21%
December,2025,Dry Fruit Mix_15-2404,Berry Mix,Berry Mix Farmley Standee Pouch 200 g,Value Added,Berry Mix,11110,12931,4908,9013,-1821.2,0.697007192,1.163927343,116.39%
December,2025,Dry Fruit Mix_15-2405,Berry Mix,Berry Mix Farmley Standee Pouch 400 g - Pack of 2 (200 g Each),Value Added,Berry Mix,267,0,0,0,266.8,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2406,Seed Mix,Seed Mix Farmley Standee Pouch 400 g - Pack of 2 (200 g Each),Value Added,Seed Mix,114,234,0,228,-120.4,0.974358974,2.059859155,205.26%
December,2025,Dry Fruit Mix_15-2627,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley Standee Pouch 60 g,Value Added,Savoury Mixes,30,21,0,0,9,0,0.7,70.00%
December,2025,Dry Fruit Mix_15-2681,Trail Mix,Trail Mix Farmley Standee Pouch - Pack of 2 (200 g Each),Value Added,Trail Mixes,103,0,0,0,102.8,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2787,Trail Mix,Trail Mix Farmley Standee Pouch 160 g,Value Added,Trail Mixes,679,58.08,9.6,58.08,621.28,1,0.085492228,8.55%
December,2025,Dry Fruit Mix_15-2800,Premium Panchmewa Superfood,Premium Panchmeva Farmley Jar 425 g- Institutional,Value Added,Trail Mixes,7813,3325.2,3366.4,3070.2,4488,0.923312883,0.425587467,42.56%
December,2025,Dry Fruit Mix_15-2801,Premium Panchmewa Superfood,Premium Panchmeva Farmley Jar 405 g,Value Added,Trail Mixes,34120,37443.465,11040.88,35654.985,-3323.43,0.95223519,1.097404062,109.74%
December,2025,Dry Fruit Mix_15-2817,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley Jar 405g,Value Added,Savoury Mixes,0,38.88,48.6,0,-38.88,0,,#DIV/0!
December,2025,Dry Fruit Mix_15-2849,Oudh Paan Snack Mix,Oudh Paan Snack Mix Farmley Pillow Pouch 18g,Value Added,Savoury Mixes,0,6.48,0.018,0,-6.48,0,,#DIV/0!
December,2025,Dry Fruit Mix_15-2851,Premium Panchmewa Superfood,Premium Panchmeva Farmley Jar 850g - Pack of 2 (425g each),Value Added,Trail Mixes,243,0,0,0,243.1,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2853,Nut Mix,Nut Mix Farmley Monocarton 50g - Institutional,Value Added,Savoury Mixes,1750,2549.9,0,1693.1,-799.9,0.663986823,1.457085714,145.71%
December,2025,Dry Fruit Mix_15-2856,Premium Panchmewa Superfood,Premium Panchmeva Farmley Pillow Pouch 21g (In SRP 8 Pcs Each),Value Added,Trail Mixes,1757,1239.945,618,1238.685,517.398,0.998983826,0.705579389,70.57%
December,2025,Dry Fruit Mix_15-2858,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley Pillow Pouch 21g (In SRP 8 Pcs Each),Value Added,Savoury Mixes,1712,855.54,600,849.24,856.821,0.99263623,0.499625955,49.97%
December,2025,Dry Fruit Mix_15-2864,Premium Panchmewa Superfood,Premium Panchmeva Farmley Jar 1 Kg,Value Added,Trail Mixes,7071,5268,1116,4368,1803,0.829157175,0.745014849,74.50%
December,2025,Dry Fruit Mix_15-2879,Tropical Savoury Mix,Tropical Savoury Mix Farmley Standee Pouch 160g,Value Added,Savoury Mixes,32,110.4,57.6,96,-78.4,0.869565217,3.45,345.00%
December,2025,Dry Fruit Mix_15-2880,Premium Panchmewa Superfood,Premium Panchmeva Farmley Standee Pouch 160g,Value Added,Trail Mixes,1584,1022.4,168,916.8,561.76,0.896713615,0.645389355,64.55%
December,2025,Dry Fruit Mix_15-2898,Premium Panchmewa Superfood,Premium Panchmeva Farmley Pillow Pouch 168g (ESHOP),Value Added,Trail Mixes,119,0,0,0,119.112,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2898,Premium Panchmewa Superfood,Premium Panchmeva Farmley Pillow Pouch 168g (ESHOP),Value Added,Trail Mixes,119,0,0,0,119.112,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2900,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley Pillow pouch 168g (ESHOP),Value Added,Savoury Mixes,77,0,0,0,77.448,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-2922,Seed Mix,Seed Mix Farmley Jar 1 kg,Value Added,Seed Mix,1839,600,504,408,1239,0.68,0.326264274,32.63%
December,2025,Dry Fruit Mix_15-2923,Trail Mix,Trail Mix Farmley Jar 450 g,Value Added,Trail Mixes,1197,594,0,453.6,602.55,0.763636364,0.496427228,49.62%
December,2025,Dry Fruit Mix_15-2941,Seed Mix,Seed mix Farmley 160g Standee Pouches,Value Added,Seed Mix,1304,180,0,165.6,1124,0.92,0.13803681,13.80%
December,2025,Dry Fruit Mix_15-2943,Berry Mix,Berry Mix Farmley 160g Standee Pouch,Value Added,Berry Mix,929,667.2,0,508.8,261.76,0.762589928,0.718222528,71.82%
December,2025,Dry Fruit Mix_15-2950,Premium Panchmewa Superfood,Premium Panchmeva Farmley Pillow Pouch 21 g - Pack of 10 (Ladi),Value Added,Trail Mixes,82,1093.68,21,1052.52,-1011.738,0.962365591,13.34700154,1333.76%
December,2025,Dry Fruit Mix_15-2951,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley 21g - Pack of 10 (Ladi),Value Added,Savoury Mixes,840,761.46,336,729.12,78.54,0.957528958,0.9065,90.65%
December,2025,Dry Fruit Mix_15-2987,Nut Mix,Nut Mix Farmley Tin Jar 50g - Institutional,Value Added,Savoury Mixes,3250,1568.7,0,1540.35,1681.3,0.981927711,0.482676923,48.27%
December,2025,Dry Fruit Mix_15-30134,Smokey BBQ Party Mix,Smokey BBQ Party Mix Pillow Pouch Farmley 28 g- Single serve,Value Added,Savoury Mixes,322,436.884,128.6,403.284,-114.884,0.923091713,1.356782609,135.68%
December,2025,Dry Fruit Mix_15-30135,Sweet and Salty Mix,Sweet and Salty Mix Farmley Pillow Pouch 23g (In SRP 8 Pcs Each),ValueAdded,Savoury Mixes,276,292.56,110,287.04,-16.56,0.981132075,1.06,106.00%
December,2025,Dry Fruit Mix_15-30136,Fruit and Nut Mix,Fruit and Nut Mix Farmley Pillow Pouch 28g- Single serve,Value Added,Savoury Mixes,70,0.084,22,0.084,69.916,1,0.0012,0.12%
December,2025,Dry Fruit Mix_15-30141,Sweet and Salty Mix,Sweet and Salty Mix Farmley Pillow Pouch 23g- Laadi (Pack of 10),Value Added,Savoury Mixes,0,113.229,0,88.389,-113.229,0.780621572,,#DIV/0!
December,2025,Dry Fruit Mix_15-30154,Premium Panchmewa Superfood,Panchmeva Farm Pillow Pouch 18g-Zepto,Value Added,Trail Mixes,1080,0,0,0,1080,NaN,0,0.00%
December,2025,Dry Fruit Mix_15-30155,Premium Panchmewa Superfood,Premium Panchmeva Farmley Pillow Pouch 30g- single serve,Value Added,Trail Mixes,5954,3916.92,2370,3787.32,2036.91,0.966912778,0.657882405,65.79%
December,2025,Dry Fruit Mix_15-30158,Mexican Peri-Peri Snack Mix,Mexican Peri-Peri Snack Mix Farmley Pillow Pouch 35 g- Single Serve,Value Added,Trail Mixes,2708,1713.74,1070,1579.34,994.42,0.921575035,0.632806038,63.28%
December,2025,Dry Fruit Mix_15-30159,Mexican Peri Peri Snack Mix,Mexican Peri Peri Snack Mix Farmley Composite Jar 325 g,Value Added,Savoury Mixes,3112,1365.975,1228,1326.975,1745.9,0.971448965,0.438955614,43.89%
December,2025,Dry Fruit Mix_15-30160,Trail Mix,Trail Mix Farmley Composite Jar 325 g,Value Added,Trail Mixes,4796,2161.575,1768,2028.975,2634.125,0.938655841,0.450731906,45.07%
December,2025,Dry Fruit Mix_15-30572,Satva Mix,Satva Mix Farmley Standee Pouch 120g,Value Added,Trail Mixes,1152,903.6,0,882,248.16,0.976095618,0.784538446,78.44%
December,2025,Gifting_18-20125,Serenity Gift,"Serenity Gift-M.Raisins100g, Classic DB80g, Chocolate Dates50g, BBQ Mix 100g, Cream & Onion Makhana 20g, M.Cranberry80g Tin Jar Farmley 430g",Value Added,Gifting Range,0,72,0,60,-72,0.833333333,,#DIV/0!
December,2025,Gifting_18-20129,Potli Gift,"Farmley R&F Salted Cashew 36 g, Thai Chilli Cashew 36 g, Party Mix 60g, Salted Almond 40g, Date Bites 20 g (Pack of 4) Potli 252g",Value Added,Gifting Range,0,90,0,0,-90,0,,#DIV/0!
December,2025,Makhana_7-2293,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,0,1.2,235.48,0,-1.2,0,,#DIV/0!
December,2025,Makhana_7-2596,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Jar 90 g - E/US,Value Added,Roasted & Flavoured Makhana,91,0,0,0,90.72,NaN,0,0.00%
December,2025,Makhana_7-2597,Peri-Peri Roasted Makhana,Roasted & Flavored Makhana - Peri-Peri Farmley Jar 90 g - E/US,Value Added,Roasted & Flavoured Makhana,91,0,0,0,90.72,NaN,0,0.00%
December,2025,Makhana_7-2598,Cream and Onion Roasted Makhana,Roasted & Flavored Makhana -Cream and Onion Farmley Jar 90 g - E/US,Value Added,Roasted & Flavoured Makhana,91,0,0,0,90.72,NaN,0,0.00%
December,2025,Makhana_7-2599,Mint Roasted Makhana,Roasted & Flavored Makhana - Mint Farmley Jar 90 g - E/US,Value Added,Roasted & Flavoured Makhana,91,0,0,0,90.72,NaN,0,0.00%
December,2025,Makhana_7-2657,Peri-Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Pillow Pouch 16 g,Value Added,Roasted & Flavoured Makhana,0,10.56,0,10.56,-10.56,1,,#DIV/0!
December,2025,Makhana_7-2658,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Pillow Pouch 16 g,Value Added,Roasted & Flavoured Makhana,0,9.6,0,9.6,-9.6,1,,#DIV/0!
December,2025,Makhana_7-2659,Cream & Onion Roasted Makhana,Roasted & Flavored Makhana - Cream & Onion Farmley Pillow Pouch 16 g,ValueAdded,Roasted & Flavoured Makhana,0,10.56,0,10.56,-10.56,1,,#DIV/0!
December,2025,Makhana_7-2660,Achaari Roasted Makhana,Roasted & Flavored Makhana - Achaari Farmley Pillow Pouch 16 g,Value Added,Roasted & Flavoured Makhana,0,9.6,0,9.6,-9.6,1,,#DIV/0!
December,2025,Makhana_7-2661,Andhra Masala Munchies,Andhra Masala Munchies Farmley Pillow Pouch 33 g,Value Added,Munchies,8518,6555.78,155.76,5842.98,1961.883,0.891271519,0.769668863,76.96%
December,2025,Makhana_7-2663,Amritsari Achari Munchies,Amritsari Achari Munchies Farmley Pillow Pouch 33 g,Value Added,Munchies,4921,2469.06,113.52,2236.74,2451.702,0.905907511,0.501763751,50.17%
December,2025,Makhana_7-2664,Spanish Tomato Munchies,Spanish Tomato Munchies Farmley Pillow Pouch 33 g,Value Added,Munchies,1251,1106.985,5.28,1001.385,144.507,0.904605753,0.884532222,88.49%
December,2025,Makhana_7-2740,Cheddar Cheese Roasted Makhana,Roasted & Flavoured Makhana - Cheddar Cheese Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,83,0,0,0,83,NaN,0,0.00%
December,2025,Makhana_7-2742,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,100,5.976,0,0,93.624,0,0.06,5.98%
December,2025,Makhana_7-2743,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,228,0,0,0,227.752,NaN,0,0.00%
December,2025,Makhana_7-2744,Cream N Onion Roasted Makhana,Roasted & Flavored Makhana - Cream N Onion Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,193,0,0,0,192.892,NaN,0,0.00%
December,2025,Makhana_7-2745,Mint Roasted Makhana,Roasted & Flavored Makhana - Mint Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,170,5.976,0,0,164.34,0,0.035087719,3.52%
December,2025,Makhana_7-2746,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Jar 83 g,Value Added,Roasted & Flavoured Makhana,287,5.976,0,0,280.872,0,0.020833333,2.08%
December,2025,Makhana_7-2753,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Standee Pouch 180 g,Value Added,Roasted & Flavoured Makhana,4,0,0,0,4.32,NaN,0,0.00%
December,2025,Makhana_7-2754,Cream N Onion Roasted Makhana,Roasted & Flavored Makhana - Cream N Onion Farmley Standee Pouch 180 g,Value Added,Roasted & Flavoured Makhana,4,0,0,0,4.32,NaN,0,0.00%
December,2025,Makhana_7-2755,Achaari Roasted Makhana,Roasted & Flavored Makhana - Achaari Farmley Standee Pouch 180 g,Value Added,Roasted & Flavoured Makhana,4,0,0,0,4.32,NaN,0,0.00%
December,2025,Makhana_7-2756,Minty Pudina Roasted Makhana,Roasted & Flavored Makhana - Minty Pudina Farmley Standee Pouch 180 g,Value Added,Roasted & Flavoured Makhana,4,0,0,0,4.32,NaN,0,0.00%
December,2025,Makhana_7-2757,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Standee Pouch 180 g,Value Added,Roasted & Flavoured Makhana,4,0,0,0,4.32,NaN,0,0.00%
December,2025,Makhana_7-2871,Aachari Munchies,Aachari Munchies Farmley Pillow Pouch 33 g,Value Added,Munchies,65,0,0,0,64.68,NaN,0,0.00%
December,2025,Makhana_7-2872,Masala Munchies,Masala Munchies Farmley Pillow Pouch 33 g,Value Added,Munchies,272,0,0,0,272.25,NaN,0,0.00%
December,2025,Makhana_7-2979,Cheddar Cheese Roasted Makhana,Roasted & Flavored Makhana -Cheddar Cheese Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,1099,1279.047,376.838,1262.415,-180.411,0.986996569,1.164213625,116.38%
December,2025,Makhana_7-2980,Mint Roasted Makhana,Roasted & Flavored Makhana - Mint Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,1296,850.388,442.981,828.135,446.061,0.973831945,0.655936331,65.62%
December,2025,Makhana_7-2981,Black Pepper Roasted Makhana,Roasted & Flavored Makhana - Black Pepper Farmley Composite jar 77 g,Value Added,Roasted & Flavoured Makhana,1211,501.116,431.123,493.647,709.786,0.985095267,0.413836958,41.38%
December,2025,Makhana_7-2982,Achaari Roasted Makhana,Roasted & Flavored Makhana - Achaari Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,508,399.476,186.008,384.615,108.955,0.962798766,0.785703468,78.64%
December,2025,Makhana_7-2983,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,3859,3426.5,1439.183,3315.543,432.355,0.967617978,0.887957697,88.79%
December,2025,Makhana_7-2984,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,8672,7872.788,3275.479,7680.519,799.183,0.975578029,0.907842981,90.78%
December,2025,Makhana_7-2985,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,1825,1330.791,649.264,1255.023,494.571,0.94306544,0.729055935,72.92%
December,2025,Makhana_7-2986,Cream and Onion Roasted Makhana,Roasted & Flavored Makhana -Cream and Onion Farmley Composite Jar 77 g,Value Added,Roasted & Flavoured Makhana,3332,3633.476,1289.418,3531.759,-300.993,0.972005595,1.090320941,109.05%
December,2025,Makhana_7-2992,Peri Peri Roasted Makhana,Roasted & Flavoured Peri Peri Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,1685,1599.73,657.525,1547.755,85.415,0.967510142,0.949312967,94.94%
December,2025,Makhana_7-2993,Minty Pudina Roasted Makhana,Roasted & Flavoured Minty Pudina Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,612,281.05,226.215,261.8,331.265,0.931506849,0.458995778,45.92%
December,2025,Makhana_7-2994,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,2258,1432.255,886.545,1393.755,825.385,0.973119312,0.634403625,63.43%
December,2025,Makhana_7-2995,Cream & Onion Roasted Makhana,Roasted & Flavoured Cream & Onion Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,1592,1230.13,620.18,1187.78,361.57,0.965572744,0.772840359,77.27%
December,2025,Makhana_7-2996,Tangy Tomato Roasted Makhana,Roasted & Flavoured Tangy Tomato Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,866,676.5,346.225,641.85,189.145,0.948780488,0.781498189,78.12%
December,2025,Makhana_7-2997,Achaari Roasted Makhana,Roasted & Flavoured Achaari Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,755,608.3,285.505,587.125,146.795,0.965189873,0.805593998,80.57%
December,2025,Makhana_7-2998,Cheddar Cheese Roasted Makhana,Roasted & Flavoured Cheddar Cheese Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,1907,1208.9,432.85,1168.475,698.28,0.96656051,0.633867805,63.39%
December,2025,Makhana_7-2999,Salt & Pepper Roasted Makhana,Roasted & Flavoured Salt & Pepper Makhana Farmley Jar 55 g,Value Added,Roasted & Flavoured Makhana,836,681.45,334.51,660.275,154.88,0.968926554,0.814809943,81.51%
December,2025,Makhana_7-3003,Cream N Onion Roasted Makhana,Roasted & Flavored Makhana - Cream N Onion Farmley Jar 154 g - Pack of 2 (77 g Each),Value Added,Roasted & Flavoured Makhana,74,40.656,0,40.656,33.264,1,0.55,54.94%
December,2025,Makhana_7-30043,Roasted & Flavored Makhana Combo,Roasted & Flavored Makhana Combo Farmley Jar 385 g - Pack of 5 (77 g Each),Value Added,Roasted & Flavoured Makhana,54,0,0,0,53.9,NaN,0,0.00%
December,2025,Makhana_7-30049,Korean hot & spicy Munchies,Korean hot & spicy Munchies Farmley Pillow Pouch 33g,Value Added,Munchies,2525,1169.52,0,1077.12,1355.475,0.920993228,0.463177155,46.32%
December,2025,Makhana_7-3005,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Jar 154 g - Pack of 2 (77 g Each),Value Added,Roasted & Flavoured Makhana,97,55.44,0,55.44,42.042,1,0.568720379,57.15%
December,2025,Makhana_7-3006,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Jar 154 g - Pack of 2 (77 g Each),Value Added,Roasted & Flavoured Makhana,92,18.48,0,18.48,73.15,1,0.201680672,20.09%
December,2025,Makhana_7-3007,Roasted & Flavored Makhana Combo,Roasted & Flavored Makhana Combo Farmley Jar 308 g - Pack of 4 (77 g Each),Value Added,Roasted & Flavoured Makhana,277,0,0,0,277.2,NaN,0,0.00%
December,2025,Makhana_7-30073,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Pillow Pouch 14 g-Ladi,Value Added,Roasted & Flavoured Makhana,217,473.76,86.982,473.76,-256.284,1,2.178447277,218.32%
December,2025,Makhana_7-30074,Cream & Onion Roasted Makhana,Roasted & Flavoured Makhana - Cream & Onion Farmley Pillow Pouch 14g-Ladi,Value Added,Roasted & Flavoured Makhana,301,478.8,120.218,478.8,-178.234,1,1.59299455,159.07%
December,2025,Makhana_7-30075,Tangy Tomato Roasted Makhana,Roasted & Flavoured Tangy Tomato Farmley Pillow Pouch 14g-Ladi,Value Added,Roasted & Flavoured Makhana,211,278.04,84.252,278.04,-67.382,1,1.319864425,131.77%
December,2025,Makhana_7-30079,Achaari Roasted Makhana,Roasted & Flavoured Achaari Makhana Farmley Pillow Pouch 14g-Ladi,Value Added,Roasted & Flavoured Makhana,281,273,112.588,273,8.498,1,0.969811508,97.15%
December,2025,Makhana_7-3008,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Jar 154 g - Pack of 2 (77 g Each),Value Added,Roasted & Flavoured Makhana,84,83.16,0,83.16,0.616,1,0.992647059,99.00%
December,2025,Makhana_7-30127,Andhra Masala Munchies,Andhra Masala Farmley Pillow Pouch 25g- Ladi,Value Added,Munchies,1764,1167.25,0,1149.25,596.5,0.984579139,0.661800142,66.17%
December,2025,Makhana_7-30128,Amritsari Achaari Munchies,Amritsari Achaari Farmley Pillow Pouch 25g- Ladi,Value Added,Munchies,1605,1236.25,60,1230.25,368.75,0.995146613,0.770249221,77.02%
December,2025,Makhana_7-30129,Spanish Tomato Munchies,Spanish Tomato Munchies Farmley Pillow Pouch 25g-Ladi,Value Added,Munchies,2150,1164.25,0,1146.25,985.75,0.984539403,0.541511628,54.15%
December,2025,Makhana_7-30130,Korean Hot & Spicy Munchies,Korean Hot & Spicy Munchies Farmley Pillow Pouch 25g- Ladi,Value Added,Munchies,1764,1209.25,0,1203.25,554.5,0.995038247,0.68561304,68.55%
December,2025,Makhana_7-30151,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,599,472.8,0,462,125.9,0.97715736,0.789711041,78.93%
December,2025,Makhana_7-30152,Cream & Onion Roasted Makhana,Roasted & Flavored Makhana - Cream & Onion Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,1431,3013.2,787.74,2266.8,-1581.82,0.752289924,2.105101371,210.57%
December,2025,Makhana_7-30153,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,1996,3990,974.08,3327.6,-1994.18,0.833984962,1.999178283,199.90%
December,2025,Makhana_7-30154,Achaari Roasted Makhana,Roasted & Flavored Makhana - Achaari Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,38,0,15.2,0,38,NaN,0,0.00%
December,2025,Makhana_7-30155,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Pillow Pouch 20 g,Value Added,Roasted & Flavoured Makhana,180,960,76.8,667.24,-780,0.695041667,5.333333333,533.33%
December,2025,Makhana_7-30157,Makha Shaka Masala Stix,Makha Shaka Masala Stix Farmley Pillow Pouch 33 g,Value Added,Munchies,3300,2104.08,0,2098.8,1195.92,0.99749059,0.6376,63.76%
December,2025,Makhana_7-30158,Makha Shaka Flaming Hot Stix,Makha Shaka Flaming Hot Stix Farmley Pillow Pouch 33g,Value Added,Munchies,3300,2067.12,0,2067.12,1232.88,1,0.6264,62.64%
December,2025,Makhana_7-30159,Makha Shaka Achari Stix,Makha Shaka Achari Stix Farmley Pillow Pouch 33 g,Value Added,Munchies,3300,2061.84,0,2019.6,1238.16,0.979513444,0.6248,62.48%
December,2025,Makhana_7-30161,Cheddar Cheese Roasted Makhana,Roasted & Flavoured Makhana - Cheddar Cheese Farmley Composite Jar 83 g,Value Added,Roasted & Flavoured Makhana,0,169.32,0,169.32,-169.32,1,,#DIV/0!
December,2025,Makhana_7-30163,Tangy Tomato Roasted Makhana,Roasted & Flavored Makhana - Tangy Tomato Farmley Composite Jar 83 g,Value Added,Roasted & Flavoured Makhana,0,205.176,0,205.176,-205.176,1,,#DIV/0!
December,2025,Makhana_7-30164,Peri Peri Roasted Makhana,Roasted & Flavored Makhana - Peri Peri Farmley Composite Jar 83 g,Value Added,Roasted & Flavoured Makhana,0,221.195,0,221.195,-221.195,1,,#DIV/0!
December,2025,Makhana_7-30165,Cream N Onion Roasted Makhana,Roasted & Flavored Makhana - Cream N Onion Farmley Composite Jar 83 g,Value Added,Roasted & Flavoured Makhana,0,243.107,0,243.107,-243.107,1,,#DIV/0!
December,2025,Makhana_7-30166,Mint Roasted Makhana,Roasted & Flavored Makhana - Mint Farmley Composite  Jar 83 g,Value Added,Roasted & Flavoured Makhana,0,195.299,0,195.299,-195.299,1,,#DIV/0!
December,2025,Makhana_7-30167,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Composite Jar 83 g,Value Added,Roasted & Flavoured Cashew,0,267.011,0,267.011,-267.011,1,,#DIV/0!
December,2025,Makhana_7-3069,Roasted & Salted Makhana,Roasted & Salted Makhana Farmley Composite Jar 57 g-Institutional,Value Added,Roasted & Flavoured Makhana,35,41.895,0,41.895,-7.125,1,1.204918033,119.70%
December,2025,Makhana_7-3070,Peri Peri Roasted Makhana,Roasted & Flavoured Makhana - Peri Peri Farmley Composite Jar 57 g-Institutional,Value Added,Roasted & Flavoured Makhana,32,29.925,0,29.925,1.995,1,0.9375,93.52%
December,2025,Makhana_7-3071,Cream & Onion Roasted Makhana,Roasted & Flavoured Makhana - Cream & Onion Farmley Composite Jar 57 g-Institutional,Value Added,Roasted & Flavoured Makhana,32,27.93,0,27.93,3.99,1,0.875,87.28%
December,2025,Makhana_7-3072,Tangy Tomato Roasted Makhana,Roasted & Flavoured Tangy Tomato Farmley Composite Jar 57 g-Institutional,Value Added,Roasted & Flavoured Makhana,32,17.955,0,17.955,13.965,1,0.5625,56.11%
December,2025,Pistachio_8-1731,Premium California Pistachios (Raw),Premium California Roasted & Salted Pistachios Farmley Standee Pouch 200 g,Value Added,Pistachio,5712,4362.4,192,4038.4,1350,0.925728957,0.763672012,76.37%
December,2025,Pistachio_8-1737,Premium Irani Pistachios (Raw),Jumbo Iranian Roasted & Salted Pistachios Farmley Standee Pouch 200 g,Value Added,Pistachio,0,12,0,0,-12,0,,#DIV/0!
December,2025,Pistachio_8-2578,Premium California Pistachios,Premium California Roasted & Salted Pistachios Farmley Standee Pouch 400 g - Pack of 2 (200 g each),Value Added,Pistachio,135,0,0,0,134.8,NaN,0,0.00%
December,2025,Pistachio_8-2936,Premium California Pistachios (Raw),Premium California Roasted & Salted Pistachios Farmley Standee Pouch 35 g,Value Added,Pistachio,79,39.2,0,39.2,40.075,1,0.494481236,49.62%
December,2025,Seeds_11-20156,Seed Mix,Seed Mix Farmley Pillow Pouch 18g- Zepto,Value Added,Seed Mix,1080,0,0,0,1080,NaN,0,0.00%
December,2025,Seeds_11-2842,Seed Mix,Seed Mix Farmley Jar 325g - E/US,Value Added,Seed Mix,234,0,0,0,234,NaN,0,0.00%
December,2025,Seeds_11-30135,Rosted & Salted Pumpkin Seeds,Salted Pumpkin Seeds Pillow Pouch Farmley 24 g (In SRP 8 Pcs Each),Value Added,Other Seeds,288,400.392,0,83.592,-112.392,0.2087754,1.39025,139.03%
December,2025,Seeds_11-30142,Rosted & Salted Pumpkin Seeds,Salted Pumpkin Seeds Pillow Pouch Farmley 24g-Ladi,Value Added,Other Seeds,0,103.68,0,11.52,-103.68,0.111111111,,36.00%`;

const App: React.FC = () => {
  const [data] = useState<InventoryRecord[]>(() => parseCSV(RAW_CSV));
  const [filters, setFilters] = useState<FilterState>({
    month: [],
    year: [],
    itemGroup: [],
    itemType: [],
    itemParent: [],
  });
  
  const [searchName, setSearchName] = useState('');
  const [searchGroup, setSearchGroup] = useState('');
  const [searchParent, setSearchParent] = useState('');
  
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo(() => {
    let filtered = data.filter(item => {
      if (isNaN(item.soQty) || isNaN(item.projection)) return false;

      const matchMonth = filters.month.length === 0 || filters.month.includes(item.month);
      const matchYear = filters.year.length === 0 || filters.year.includes(String(item.year));
      const matchGroupFilter = filters.itemGroup.length === 0 || filters.itemGroup.includes(item.itemGroup);
      const matchTypeFilter = filters.itemType.length === 0 || filters.itemType.includes(item.itemType);
      const matchParentFilter = filters.itemParent.length === 0 || filters.itemParent.includes(item.itemParent);
      
      const matchSearchName = searchName === '' || 
        item.itemName.toLowerCase().includes(searchName.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchName.toLowerCase());
      
      const matchSearchGroup = searchGroup === '' ||
        item.itemGroup.toLowerCase().includes(searchGroup.toLowerCase());
      
      const matchSearchParent = searchParent === '' ||
        item.itemParent.toLowerCase().includes(searchParent.toLowerCase());

      return matchMonth && matchYear && matchGroupFilter && matchTypeFilter && 
             matchParentFilter && matchSearchName && matchSearchGroup && matchSearchParent;
    });

    return filtered.sort((a, b) => {
      const aVal = isNaN(a.soVsProj) ? -Infinity : a.soVsProj;
      const bVal = isNaN(b.soVsProj) ? -Infinity : b.soVsProj;
      return bVal - aVal;
    });
  }, [data, filters, searchName, searchGroup, searchParent]);

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const resetFilters = () => {
    setFilters({
      month: [],
      year: [],
      itemGroup: [],
      itemType: [],
      itemParent: [],
    });
    setSearchName('');
    setSearchGroup('');
    setSearchParent('');
    setSelectedGroupName(null);
  };

  const handleExport = () => {
    downloadAsCSV(processedData, `filtered_inventory_report.csv`);
  };

  const handleDownloadParentFile = () => {
    downloadAsCSV(data, `raw_parent_inventory_source.csv`);
  };

  const groupPerformanceData = useMemo(() => {
    const groups: Record<string, { name: string; so: number; proj: number; dispatch: number; ratio: number }> = {};
    
    processedData.forEach(item => {
      const gName = item.itemGroup || 'Other';
      if (!groups[gName]) groups[gName] = { name: gName, so: 0, proj: 0, dispatch: 0, ratio: 0 };
      groups[gName].so += item.soQty || 0;
      groups[gName].proj += item.projection || 0;
      groups[gName].dispatch += item.dispatch || 0;
    });

    const result = Object.values(groups).map(g => ({
      ...g,
      ratio: g.proj > 0 ? g.so / g.proj : 0,
      percentage: g.proj > 0 ? `${(g.so / g.proj * 100).toFixed(1)}%` : '0%'
    }));

    return result.sort((a, b) => b.ratio - a.ratio);
  }, [processedData]);

  const totals = useMemo(() => {
    return processedData.reduce((acc, curr) => ({
      projection: acc.projection + (curr.projection || 0),
      soQty: acc.soQty + (curr.soQty || 0),
      dispatch: acc.dispatch + (curr.dispatch || 0)
    }), { projection: 0, soQty: 0, dispatch: 0 });
  }, [processedData]);

  const selectedStats = useMemo(() => {
    if (!selectedGroupName) return null;
    return groupPerformanceData.find(g => g.name === selectedGroupName);
  }, [selectedGroupName, groupPerformanceData]);

  const handleBarClick = (chartData: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload.length) {
      const group = chartData.activePayload[0].payload;
      setSelectedGroupName(group.name === selectedGroupName ? null : group.name);
    }
  };

  const handleRowClick = (group: string) => {
    setSelectedGroupName(group === selectedGroupName ? null : group);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar 
        data={data} 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={resetFilters} 
      />

      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 space-y-6 scroll-smooth">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Supply Performance Analytics</h1>
            <p className="text-sm text-slate-500 mt-1">SO vs Projections Dashboard • Multi-metric Visualization</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm"
            >
              <Icons.Download className="w-4 h-4" />
              Filtered CSV
            </button>
            <button 
              onClick={handleDownloadParentFile}
              className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-900 transition-all shadow-md"
            >
              <Icons.Download className="w-4 h-4" />
              Download Parent File
            </button>
          </div>
        </header>

        {/* Search & Global Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <section className="xl:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Name / Code</label>
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Group</label>
              <div className="relative">
                <Icons.Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                  placeholder="Search groups..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Parent</label>
              <div className="relative">
                <Icons.TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchParent}
                  onChange={(e) => setSearchParent(e.target.value)}
                  placeholder="Search parents..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Projection</div>
              <div className="text-2xl font-black text-slate-900">{totals.projection.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl"><Icons.TrendingUp className="w-6 h-6 text-slate-400" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total SO Qty</div>
              <div className="text-2xl font-black text-blue-600">{totals.soQty.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl"><Icons.Search className="w-6 h-6 text-blue-600" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Dispatch</div>
              <div className="text-2xl font-black text-emerald-600">{totals.dispatch.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl"><Icons.Download className="w-6 h-6 text-emerald-600 rotate-180" /></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Global SO VS Proj Ratio</div>
              <div className="text-2xl font-black text-slate-900">{(totals.projection > 0 ? totals.soQty / totals.projection : 0).toFixed(2)}x</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl"><Icons.Filter className="w-6 h-6 text-slate-400" /></div>
          </div>
        </div>

        {/* Selection feedback */}
        {selectedStats && (
          <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icons.TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{selectedStats.name} Details</h4>
                <p className="text-blue-100 text-xs font-medium">
                  Projection: {selectedStats.proj.toLocaleString()} | SO Qty: <span className="text-white font-bold">{selectedStats.so.toLocaleString()}</span> | Dispatch: <span className="text-emerald-300 font-bold">{selectedStats.dispatch.toLocaleString()}</span> | SO VS Proj Ratio: {selectedStats.percentage}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedGroupName(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/20"
            >
              Reset View
            </button>
          </div>
        )}

        {/* Bar Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Supply Performance (Proj vs SO vs Dispatch)
            </h3>
          </div>
          <div className="h-[700px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={groupPerformanceData} 
                layout="vertical"
                margin={{ top: 10, right: 100, left: 100, bottom: 5 }}
                onClick={handleBarClick}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  width={150}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number, name: string, props: any) => {
                    const label = props.dataKey === 'proj' ? 'Projection' : props.dataKey === 'so' ? 'SO Qty' : 'Dispatch';
                    return [value.toLocaleString(), label];
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                <Bar 
                  dataKey="proj" 
                  name="Projection" 
                  fill="#e2e8f0" 
                  radius={[0, 4, 4, 0]} 
                  barSize={12}
                >
                  <LabelList dataKey="proj" position="insideRight" fontSize={8} fill="#64748b" offset={4} formatter={(v: number) => v.toLocaleString()} />
                  {groupPerformanceData.map((entry, index) => (
                    <Cell 
                      key={`proj-cell-${index}`} 
                      className="cursor-pointer transition-all duration-300"
                      fillOpacity={selectedGroupName && entry.name !== selectedGroupName ? 0.3 : 1}
                      stroke={entry.name === selectedGroupName ? '#94a3b8' : 'none'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
                
                <Bar 
                  dataKey="so" 
                  name="SO Qty" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]} 
                  barSize={12}
                >
                  <LabelList dataKey="so" position="right" fontSize={9} fill="#3b82f6" fontWeight="bold" offset={6} formatter={(v: number) => v.toLocaleString()} />
                  {groupPerformanceData.map((entry, index) => (
                    <Cell 
                      key={`so-cell-${index}`} 
                      className="cursor-pointer transition-all duration-300"
                      fillOpacity={selectedGroupName && entry.name !== selectedGroupName ? 0.3 : 1}
                      fill={entry.name === selectedGroupName ? '#2563eb' : '#3b82f6'}
                      stroke={entry.name === selectedGroupName ? '#1e40af' : 'none'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>

                <Bar 
                  dataKey="dispatch" 
                  name="Dispatch" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                  barSize={12}
                >
                  <LabelList dataKey="dispatch" position="right" fontSize={9} fill="#059669" fontWeight="bold" offset={45} formatter={(v: number) => v.toLocaleString()} />
                  {groupPerformanceData.map((entry, index) => (
                    <Cell 
                      key={`dispatch-cell-${index}`} 
                      className="cursor-pointer transition-all duration-300"
                      fillOpacity={selectedGroupName && entry.name !== selectedGroupName ? 0.3 : 1}
                      fill={entry.name === selectedGroupName ? '#059669' : '#10b981'}
                      stroke={entry.name === selectedGroupName ? '#064e3b' : 'none'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest italic">
            Sorted by SO VS Proj Ratio. Proj (Gray), SO (Blue), Dispatch (Green).
          </p>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden" ref={tableRef}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Inventory Records <span className="text-slate-400 font-normal text-xs ml-2">({processedData.length} valid entries)</span></h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">Item Name / Parent</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">Group</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 text-right">Proj</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 text-right">SO Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 text-right">Dispatch</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 text-right">SO VS Proj Ratio</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase border-b border-slate-100 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {processedData.map((item, idx) => {
                  const isHighlighted = item.itemGroup === selectedGroupName;
                  return (
                    <tr 
                      key={`${item.itemCode}-${idx}`} 
                      onClick={() => handleRowClick(item.itemGroup)}
                      className={`cursor-pointer transition-all duration-200 ${
                        isHighlighted 
                        ? 'bg-blue-50/80 hover:bg-blue-100 ring-1 ring-inset ring-blue-100' 
                        : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-semibold line-clamp-1 ${isHighlighted ? 'text-blue-900' : 'text-slate-800'}`}>
                            {item.itemName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono italic">{item.itemParent || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isHighlighted ? 'bg-blue-200 text-blue-800 font-bold' : 'text-slate-600'}`}>
                          {item.itemGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-right tabular-nums">{item.projection.toLocaleString()}</td>
                      <td className={`px-6 py-4 text-sm text-right tabular-nums ${isHighlighted ? 'font-black text-blue-600' : 'font-bold text-slate-900'}`}>
                        {item.soQty.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-600 text-right tabular-nums font-medium">
                        {(item.dispatch || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-black ${item.soVsProj > 1.0 ? 'text-blue-600' : 'text-slate-700'}`}>{item.soVsProj.toFixed(2)}x</span>
                          <span className="text-[10px] text-slate-400">{item.soVsProjPercentage}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge value={item.soVsProj} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatusBadge: React.FC<{ value: number }> = ({ value }) => {
  if (value > 1.2) return <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-blue-600 text-white shadow-sm shadow-blue-100">Aggressive</span>;
  if (value > 0.8) return <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-slate-200 text-slate-700">Healthy</span>;
  return <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-amber-100 text-amber-700">Low Flow</span>;
};

export default App;
