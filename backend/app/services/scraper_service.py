import requests
import urllib.parse
from bs4 import BeautifulSoup

class NutritionScraper:
    @staticmethod
    def extract_bold_nutrients(html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        
        nutrients = {}
        
        portion_size = soup.find('span', id='serving-size')
        if portion_size:
            nutrients['Portion Size'] = portion_size.get_text(strip=True)
        
        calories_cell = soup.find('td', id='calories')
        if calories_cell:
            nutrients['Calories'] = calories_cell.get_text(strip=True)
        
        bold_tags = soup.find_all('b')
        
        for bold_tag in bold_tags:
            parent_td = bold_tag.find_parent('td', class_='left')
            
            if parent_td:
                full_text = parent_td.get_text(strip=True)
                
                if full_text in ['Amount Per Portion', '% Daily Value *']:
                    continue
                
                nutrient_text = full_text
                bold_text = bold_tag.get_text(strip=True).replace('\xa0', ' ')
                
                if bold_text == 'Total Fat':
                    value = nutrient_text.replace('Total Fat', '').replace('Total\xa0Fat', '').strip()
                    nutrients['Total Fat'] = value
                
                elif bold_text == 'Total Carbohydrate':
                    value = nutrient_text.replace('Total Carbohydrate', '').replace('Total\xa0Carbohydrate', '').strip()
                    nutrients['Total Carbohydrate'] = value
                
                elif bold_text == 'Protein':
                    value = nutrient_text.replace('Protein', '').replace('Protein', '').strip()
                    nutrients['Protein'] = value
        
        return nutrients

    @staticmethod
    def scrape_nutrition_with_proxy(food_item):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        base_url = "https://www.nutritionvalue.org"
        search_url = f"{base_url}/search.php?food_query={food_item.replace(' ', '+')}"
        
        encoded_search_url = urllib.parse.quote(search_url)
        proxy_search_url = f"https://api.scrape.do/?url={encoded_search_url}&token=fac310728e2a4fafabf5b4d614184cab8bcc93d9b32"
        
        try:
            print(f"🔍 Searching for: {food_item}")
            search_response = requests.get(proxy_search_url, headers=headers, timeout=10)
            search_soup = BeautifulSoup(search_response.content, 'html.parser')
            
            first_result = search_soup.find('a', class_='table_item_name')
            if not first_result:
                return {'error': f"No results found for {food_item}"}
            
            product_url = base_url + first_result['href']
            print(f"Found product: {product_url}")
            
            encoded_product_url = urllib.parse.quote(product_url)
            proxy_product_url = f"http://api.scrape.do/?url={encoded_product_url}&token=fac310728e2a4fafabf5b4d614184cab8bcc93d9b32"
            
            product_response = requests.get(proxy_product_url, headers=headers, timeout=10)
            product_soup = BeautifulSoup(product_response.content, 'html.parser')
            
            all_tables = product_soup.find_all('table')
            target_table = None
            for table in all_tables:
                classes = table.get('class', [])
                if classes == ['center', 'zero']:
                    target_table = table
                    break
            
            if not target_table:
                return {'error': 'Nutrition table not found'}
            
            html_content = str(target_table)
            nutrients = NutritionScraper.extract_bold_nutrients(html_content)
            
            formatted_nutrients = {
                'name': food_item.title(),
                'portion_size': nutrients.get('Portion Size', 'N/A'),
                'calories': nutrients.get('Calories', 'N/A'),
                'total_fat': nutrients.get('Total Fat', 'N/A'),
                'total_carbohydrate': nutrients.get('Total Carbohydrate', 'N/A'),
                'protein': nutrients.get('Protein', 'N/A')
            }
            
            print(f"Scraped nutrients: {formatted_nutrients}")
            return formatted_nutrients
            
        except Exception as e:
            print(f"Error: {str(e)}")
            return {'error': f'Scraping error: {str(e)}'}

    @staticmethod
    def search_food(food_name):
        if not food_name or not food_name.strip():
            return {'error': 'Food name is required'}
        
        return NutritionScraper.scrape_nutrition_with_proxy(food_name.strip())