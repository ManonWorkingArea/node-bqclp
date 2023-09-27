export async function getStock(productId) {
    try {
      const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/product/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (resAPI.ok) {
        const product = await resAPI.json();
        return product.stock;
      } else {
        // Handle error condition
      }
    } catch (error) {
      console.error(error);
    }
}

export async function updateStock(productId, quantity) {
  try {
    const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          stock: quantity
        },
        options: {}
      })
    });

    if (resAPI.ok) {
      await resAPI.json();
      // Stock updated successfully
    } else {
      // Handle error condition
      console.error('Failed to update product stock.');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addStock(productId, quantity) {
  try {
    const currentStock = await getStock(productId);
    const newStock = currentStock + quantity;

    const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          stock: newStock
        },
        options: {}
      })
    });

    if (resAPI.ok) {
      await resAPI.json();
      // Stock added successfully
    } else {
      // Handle error condition
      console.error('Failed to add product stock.');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removeStock(productId, quantity) {
  try {
    const currentStock = await getStock(productId);
    const newStock = currentStock - quantity;

    const resAPI = await fetch(`https://multisource-api-edsdv.ondigitalocean.app/api/DU1eYMDG7j8yb199YDPg2/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          stock: newStock
        },
        options: {}
      })
    });

    if (resAPI.ok) {
      await resAPI.json();
      // Stock removed successfully
    } else {
      // Handle error condition
      console.error('Failed to remove product stock.');
    }
  } catch (error) {
    console.error(error);
  }
}
