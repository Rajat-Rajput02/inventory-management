const printInventory = (products) => {
  const table = `
  <table border="1" cellspacing="0" cellpadding="8" width="100%">
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Selling Price</th>
      <th>Cost Price</th>
      <th>Quantity</th>
      <th>Min Stock</th>
    </tr>

    ${products
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.sellingPrice ?? item.price ?? 0}</td>
        <td>${item.costPrice ?? 0}</td>
        <td>${item.quantity}</td>
        <td>${item.minStock}</td>
      </tr>
    `
      )
      .join("")}
  </table>
  `;

  const win = window.open();

  win.document.write(table);

  win.print();

  win.close();
};

export default printInventory;