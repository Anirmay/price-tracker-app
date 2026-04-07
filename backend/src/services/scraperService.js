const axios = require('axios');
const cheerio = require('cheerio');

// Parse Amazon URL to extract product ID
const parseAmazonUrl = (url) => {
  const asinRegex = /\/dp\/([A-Z0-9]{10})/;
  const match = url.match(asinRegex);
  return match ? match[1] : null;
};

// Parse Flipkart URL to extract product ID
const parseFlipkartUrl = (url) => {
  const pidRegex = /\/p\/([A-Za-z0-9]+)/;
  const match = url.match(pidRegex);
  return match ? match[1] : null;
};

// Scrape Amazon product details
const scrapeAmazonProduct = async (url, retries = 3) => {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await axios.get(url, { headers, timeout: 15000 });
    const $ = cheerio.load(response.data);

    const name = $('#productTitle').text().trim();
    const priceText = $('.a-price-whole').first().text().trim();
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
    const image = $('#landingImage').attr('src');
    const inStock = !$('.a-color-price').text().includes('Currently unavailable');

    return {
      name,
      price,
      image,
      inStock,
    };
  } catch (error) {
    // Retry on 503 or network errors with exponential backoff
    if (retries > 0 && (error.response?.status === 503 || !error.response)) {
      const delay = Math.pow(2, 4 - retries) * 1000; // 2s, 4s, 8s
      console.log(`Retrying Amazon scrape in ${delay}ms (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return scrapeAmazonProduct(url, retries - 1);
    }
    console.error('Error scraping Amazon:', error.message);
    throw error;
  }
};

// Scrape Flipkart product details
const scrapeFlipkartProduct = async (url, retries = 3) => {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    const response = await axios.get(url, { headers, timeout: 15000 });
    const $ = cheerio.load(response.data);

    const name = $('.B_NuCI').text().trim();
    const priceText = $('._30jeq3._16Jk6d').text().trim();
    const price = parseFloat(priceText.replace(/[^\d]/g, ''));
    const image = $('.MNPQK2._3qKH6N')
      .attr('src')
      ?.split('?')[0];
    const inStock = !$('.EYVVUL').text().includes('Out of Stock');

    return {
      name,
      price,
      image,
      inStock,
    };
  } catch (error) {
    // Retry on 503 or network errors with exponential backoff
    if (retries > 0 && (error.response?.status === 503 || !error.response)) {
      const delay = Math.pow(2, 4 - retries) * 1000; // 2s, 4s, 8s
      console.log(`Retrying Flipkart scrape in ${delay}ms (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return scrapeFlipkartProduct(url, retries - 1);
    }
    console.error('Error scraping Flipkart:', error.message);
    throw error;
  }
};

// Main function to fetch product details
const fetchProductDetails = async (url) => {
  try {
    let platform, productId, productData;

    if (url.includes('amazon')) {
      platform = 'amazon';
      productId = parseAmazonUrl(url);
      productData = await scrapeAmazonProduct(url);
    } else if (url.includes('flipkart')) {
      platform = 'flipkart';
      productId = parseFlipkartUrl(url);
      productData = await scrapeFlipkartProduct(url);
    } else {
      throw new Error('Unsupported platform');
    }

    return {
      platform,
      productId,
      ...productData,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

module.exports = {
  fetchProductDetails,
  parseAmazonUrl,
  parseFlipkartUrl,
  scrapeAmazonProduct,
  scrapeFlipkartProduct,
};
