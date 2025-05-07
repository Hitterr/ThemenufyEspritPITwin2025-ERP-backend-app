const Stock = require('../../models/stock');
const Supplier = require('../../models/supplier');



const mongoose = require('mongoose');

const path = require('path');
const fs = require('fs').promises;
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

const calculateStockNeeds = async (restaurantId) => {
  const stocks = await Stock.find({ restaurant: restaurantId });
  if (!stocks.length) {
    throw new Error('No stocks found for this restaurant');
  }

  const stockNeeds = stocks
    .filter((stock) => stock.quantity < stock.minQty)
    .map((stock) => ({
      stockId: stock._id,
      libelle: stock.libelle,
      orderQty: stock.maxQty - stock.quantity,
      unit: stock.unit,
    }));

  if (!stockNeeds.length) {
    throw new Error('No orders needed at this time');
  }

  return stockNeeds;
};

const selectSuppliers = async (stockNeeds, restaurantId) => {
  const suppliers = await Supplier.find({ restaurantId, status: 'active' });
  if (!suppliers.length) {
    throw new Error('No active suppliers found');
  }

  const orders = [];
  for (const need of stockNeeds) {
    const supplierStock = suppliers
      .flatMap((supplier) => supplier.stocks)
      .find((stock) => stock.stockId.toString() === need.stockId.toString());

    if (supplierStock) {
      const supplier = suppliers.find((s) =>
        s.stocks.some((stock) => stock.stockId.toString() === need.stockId.toString())
      );
      orders.push({
        supplier: {
          name: supplier.name,
          email: supplier.contact.email,
        },
        stock: need,
        pricePerUnit: supplierStock.pricePerUnit,
        totalCost: supplierStock.pricePerUnit * need.orderQty,
        forecastDays: supplierStock.leadTimeDays,
      });
    }
  }

  return orders;
};

const ensureOutputDir = async () => {
  const outputDir = path.join(__dirname, '../../output/orders');
  await fs.mkdir(outputDir, { recursive: true });
  return outputDir;
};

const generatePDF = async (orders, restaurantId, filePath) => {
  const doc = new PDFDocument({ margin: 30 });
  const stream = require('fs').createWriteStream(filePath);
  doc.pipe(stream);

  // Colors from email template
  const pink = '#FFC0CB';
  const darkGray = '#333';
  const lightGray = '#666';

  // Wave header
  doc.save();
  doc.fillColor(pink);
  doc.path('M0,0 C150,100 350,100 500,0 V100 H0 Z').fill();
  doc.restore();

  // Circular icon
  doc
    .circle(50, 120, 30)
    .fill(pink)
    .fontSize(30)
    .fillColor('white')
    .text('📋', 40, 110, { align: 'center' });

  // Title
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor(darkGray)
    .text('Purchase Order', 0, 150, { align: 'center' });

  // Subtitle
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(lightGray)
    .text(`Restaurant ID: ${restaurantId}`, 0, 175, { align: 'center' });

  // Table
  const tableTop = 220;
  const tableLeft = 50;
  const rowHeight = 20;
  const colWidths = [100, 120, 80, 50, 50, 50, 50, 50];
  const headers = [
    'Supplier Name',
    'Supplier Email',
    'Item',
    'Quantity',
    'Unit',
    'Price/Unit',
    'Total Cost',
    'Forecast Days',
  ];

  // Header row
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(darkGray);
  headers.forEach((header, i) => {
    doc.text(header, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
      width: colWidths[i],
      align: 'left',
    });
  });

  // Header underline
  doc
    .moveTo(tableLeft, tableTop + rowHeight)
    .lineTo(tableLeft + colWidths.reduce((a, b) => a + b, 0), tableTop + rowHeight)
    .stroke(pink);

  // Table rows
  doc.font('Helvetica').fontSize(9).fillColor(lightGray);
  orders.forEach((order, index) => {
    const y = tableTop + (index + 1) * rowHeight + 5;
    const row = [
      order.supplier.name,
      order.supplier.email,
      order.stock.libelle,
      order.stock.orderQty.toString(),
      order.stock.unit,
      `$${order.pricePerUnit.toFixed(2)}`,
      `$${order.totalCost.toFixed(2)}`,
      order.forecastDays.toString(),
    ];
    row.forEach((cell, i) => {
      doc.text(cell, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
        width: colWidths[i],
        align: 'left',
      });
    });
  });

  // Footer
  doc
    .fontSize(10)
    .fillColor(lightGray)
    .text(`Generated on: ${new Date().toLocaleString()}`, 0, doc.page.height - 50, { align: 'center' });

  doc.end();
  await new Promise((resolve) => stream.on('finish', resolve));
};

const generateExcel = async (orders, restaurantId, filePath) => {
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    ['Supplier Name', 'Supplier Email', 'Item', 'Quantity', 'Unit', 'Price/Unit', 'Total Cost', 'Forecast Days'],
    ...orders.map((order) => [
      order.supplier.name,
      order.supplier.email,
      order.stock.libelle,
      order.stock.orderQty,
      order.stock.unit,
      order.pricePerUnit,
      order.totalCost,
      order.forecastDays,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Styling
  const pink = 'FFFFC0CB';
  const darkGray = 'FF333333';
  const lightGray = 'FF666666';
  worksheet['!cols'] = [
    { wpx: 100 },
    { wpx: 150 },
    { wpx: 100 },
    { wpx: 60 },
    { wpx: 60 },
    { wpx: 60 },
    { wpx: 60 },
    { wpx: 80 },
  ];

  // Header styling
  ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'].forEach((cell) => {
    worksheet[cell].s = {
      font: { name: 'Arial', sz: 10, bold: true, color: { rgb: darkGray } },
      fill: { fgColor: { rgb: pink } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: darkGray } },
        bottom: { style: 'thin', color: { rgb: darkGray } },
        left: { style: 'thin', color: { rgb: darkGray } },
        right: { style: 'thin', color: { rgb: darkGray } },
      },
    };
  });

  // Cell styling
  for (let i = 2; i <= orders.length + 1; i++) {
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((col) => {
      const cell = `${col}${i}`;
      worksheet[cell].s = {
        font: { name: 'Arial', sz: 9, color: { rgb: lightGray } },
        fill: { fgColor: { rgb: 'FFFFFFFF' } },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: darkGray } },
          bottom: { style: 'thin', color: { rgb: darkGray } },
          left: { style: 'thin', color: { rgb: darkGray } },
          right: { style: 'thin', color: { rgb: darkGray } },
        },
      };
    });
  }

  // Add title
  XLSX.utils.sheet_add_aoa(worksheet, [[`Purchase Order - Restaurant ID: ${restaurantId}`]], { origin: 'A1' });
  XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: 'A2' }); // Spacer
  worksheet['A1'].s = {
    font: { name: 'Arial', sz: 14, bold: true, color: { rgb: darkGray } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Order');
  XLSX.writeFile(workbook, filePath);
};

const generatePurchaseOrder = async (restaurantId, format) => {
  console.log(`Generating purchase order for restaurant ${restaurantId} in ${format} format`);

  const stockNeeds = await calculateStockNeeds(restaurantId);
  const orders = await selectSuppliers(stockNeeds, restaurantId);

  if (format === 'json') {
    return { orders };
  }

  const outputDir = await ensureOutputDir();
  const timestamp = Date.now();
  const fileName = `purchase_order_${restaurantId}_${timestamp}.${format}`;
  const filePath = path.join(outputDir, fileName);

  if (format === 'xlsx') {
    await generateExcel(orders, restaurantId, filePath);
  } else {
    await generatePDF(orders, restaurantId, filePath);
  }

  console.log(`Purchase order generated: ${filePath}`);
  return { filePath, orders };
};

module.exports = {
  generatePurchaseOrder,
};