const statuses = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled', 'Refunded']
const customers = [
  'Aarav Patel', 'Sofia Chen', 'Marcus Johnson', 'Priya Sharma', 'James Wright',
  'Fatima Al-Hassan', 'Oliver Brown', 'Mei Lin', 'Carlos Rivera', 'Zoe Thompson',
  'Liam O\'Brien', 'Aisha Mohammed', 'Noah Williams', 'Elena Petrov', 'Kwame Asante',
  'Isabella Davis', 'Ravi Kumar', 'Hannah Schmidt', 'Diego Lopez', 'Nadia Kowalski'
]
const products = [
  'Pro Wireless Headphones', 'Mechanical Keyboard RGB', 'Ultra-Wide Monitor 34"',
  'Ergonomic Office Chair', 'USB-C Hub 12-in-1', 'Webcam 4K Ultra HD',
  'Standing Desk Electric', 'Noise Cancelling Buds', 'Portable SSD 2TB',
  'Wireless Mouse Precision', 'Studio USB Microphone', 'Laptop Stand Aluminium',
  'Smart LED Desk Lamp', 'NVMe SSD 1TB', 'CPU Liquid Cooler 360mm'
]

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(daysBack = 90) {
  const d = new Date()
  d.setDate(d.getDate() - randomBetween(0, daysBack))
  return d.toISOString().split('T')[0]
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Seeded for consistency
const seed = [
  [1,'ORD-10001','2025-05-28','Aarav Patel','Pro Wireless Headphones',299.99,'Delivered',1],
  [2,'ORD-10002','2025-05-27','Sofia Chen','Mechanical Keyboard RGB',149.99,'Processing',2],
  [3,'ORD-10003','2025-05-26','Marcus Johnson','Ultra-Wide Monitor 34"',699.99,'Shipped',1],
  [4,'ORD-10004','2025-05-25','Priya Sharma','Ergonomic Office Chair',459.00,'Delivered',1],
  [5,'ORD-10005','2025-05-24','James Wright','USB-C Hub 12-in-1',79.99,'Pending',3],
  [6,'ORD-10006','2025-05-23','Fatima Al-Hassan','Webcam 4K Ultra HD',199.99,'Delivered',1],
  [7,'ORD-10007','2025-05-22','Oliver Brown','Standing Desk Electric',849.00,'Shipped',1],
  [8,'ORD-10008','2025-05-21','Mei Lin','Noise Cancelling Buds',179.99,'Processing',2],
  [9,'ORD-10009','2025-05-20','Carlos Rivera','Portable SSD 2TB',189.99,'Delivered',1],
  [10,'ORD-10010','2025-05-19','Zoe Thompson','Wireless Mouse Precision',89.99,'Cancelled',1],
  [11,'ORD-10011','2025-05-18',"Liam O'Brien",'Studio USB Microphone',129.99,'Delivered',2],
  [12,'ORD-10012','2025-05-17','Aisha Mohammed','Laptop Stand Aluminium',49.99,'Delivered',1],
  [13,'ORD-10013','2025-05-16','Noah Williams','Smart LED Desk Lamp',64.99,'Processing',1],
  [14,'ORD-10014','2025-05-15','Elena Petrov','NVMe SSD 1TB',99.99,'Delivered',2],
  [15,'ORD-10015','2025-05-14','Kwame Asante','CPU Liquid Cooler 360mm',169.99,'Shipped',1],
  [16,'ORD-10016','2025-05-13','Isabella Davis','Pro Wireless Headphones',299.99,'Delivered',1],
  [17,'ORD-10017','2025-05-12','Ravi Kumar','Mechanical Keyboard RGB',149.99,'Processing',3],
  [18,'ORD-10018','2025-05-11','Hannah Schmidt','USB-C Hub 12-in-1',79.99,'Delivered',1],
  [19,'ORD-10019','2025-05-10','Diego Lopez','Webcam 4K Ultra HD',199.99,'Pending',2],
  [20,'ORD-10020','2025-05-09','Nadia Kowalski','Ergonomic Office Chair',459.00,'Delivered',1],
  [21,'ORD-10021','2025-05-08','Aarav Patel','Noise Cancelling Buds',179.99,'Shipped',2],
  [22,'ORD-10022','2025-05-07','Sofia Chen','Portable SSD 2TB',189.99,'Processing',1],
  [23,'ORD-10023','2025-05-06','Marcus Johnson','Standing Desk Electric',849.00,'Delivered',1],
  [24,'ORD-10024','2025-05-05','Priya Sharma','Wireless Mouse Precision',89.99,'Cancelled',3],
  [25,'ORD-10025','2025-05-04','James Wright','Laptop Stand Aluminium',49.99,'Delivered',2],
  [26,'ORD-10026','2025-05-03','Fatima Al-Hassan','NVMe SSD 1TB',99.99,'Refunded',1],
  [27,'ORD-10027','2025-05-02','Oliver Brown','Smart LED Desk Lamp',64.99,'Delivered',4],
  [28,'ORD-10028','2025-05-01','Mei Lin','Ultra-Wide Monitor 34"',699.99,'Processing',1],
  [29,'ORD-10029','2025-04-30','Carlos Rivera','Pro Wireless Headphones',299.99,'Delivered',2],
  [30,'ORD-10030','2025-04-29','Zoe Thompson','CPU Liquid Cooler 360mm',169.99,'Shipped',1],
  [31,'ORD-10031','2025-04-28',"Liam O'Brien",'Mechanical Keyboard RGB',149.99,'Delivered',1],
  [32,'ORD-10032','2025-04-27','Aisha Mohammed','USB-C Hub 12-in-1',79.99,'Processing',5],
  [33,'ORD-10033','2025-04-26','Noah Williams','Webcam 4K Ultra HD',199.99,'Delivered',1],
  [34,'ORD-10034','2025-04-25','Elena Petrov','Studio USB Microphone',129.99,'Pending',2],
  [35,'ORD-10035','2025-04-24','Kwame Asante','Ergonomic Office Chair',459.00,'Delivered',1],
  [36,'ORD-10036','2025-04-23','Isabella Davis','Portable SSD 2TB',189.99,'Cancelled',1],
  [37,'ORD-10037','2025-04-22','Ravi Kumar','Noise Cancelling Buds',179.99,'Delivered',3],
  [38,'ORD-10038','2025-04-21','Hannah Schmidt','Laptop Stand Aluminium',49.99,'Shipped',2],
  [39,'ORD-10039','2025-04-20','Diego Lopez','Standing Desk Electric',849.00,'Delivered',1],
  [40,'ORD-10040','2025-04-19','Nadia Kowalski','Wireless Mouse Precision',89.99,'Processing',1],
  [41,'ORD-10041','2025-04-18','Aarav Patel','NVMe SSD 1TB',99.99,'Delivered',2],
  [42,'ORD-10042','2025-04-17','Sofia Chen','Smart LED Desk Lamp',64.99,'Delivered',1],
  [43,'ORD-10043','2025-04-16','Marcus Johnson','Pro Wireless Headphones',299.99,'Refunded',1],
  [44,'ORD-10044','2025-04-15','Priya Sharma','CPU Liquid Cooler 360mm',169.99,'Delivered',2],
  [45,'ORD-10045','2025-04-14','James Wright','USB-C Hub 12-in-1',79.99,'Shipped',3],
  [46,'ORD-10046','2025-04-13','Fatima Al-Hassan','Mechanical Keyboard RGB',149.99,'Delivered',1],
  [47,'ORD-10047','2025-04-12','Oliver Brown','Ultra-Wide Monitor 34"',699.99,'Processing',1],
  [48,'ORD-10048','2025-04-11','Mei Lin','Webcam 4K Ultra HD',199.99,'Delivered',2],
  [49,'ORD-10049','2025-04-10','Carlos Rivera','Laptop Stand Aluminium',49.99,'Pending',4],
  [50,'ORD-10050','2025-04-09','Zoe Thompson','Studio USB Microphone',129.99,'Delivered',1],
]

export const orders = seed.map(([id, orderId, date, customer, product, unitPrice, status, qty]) => ({
  id,
  orderId,
  date,
  customer,
  product,
  qty,
  unitPrice,
  total: +(unitPrice * qty).toFixed(2),
  status,
  paymentMethod: ['Visa •••• 4242', 'Mastercard •••• 5678', 'PayPal', 'UPI', 'Bank Transfer'][id % 5]
}))

export const orderStatuses = ['All', ...statuses]
