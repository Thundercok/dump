import urllib.request
import urllib.parse
import re
import json
import csv
import time
import random

def get_base_pb():
    # Read the original HTML to get the dynamic fetch URL template
    try:
        with open("gmaps_response.html", "r", encoding="utf-8") as f:
            html = f.read()
    except Exception as e:
        print("Error reading gmaps_response.html. Make sure to run test_gmaps.py first.", e)
        return None
        
    match = re.search(r'<link\s+href="(/search\?tbm=map[^"]+)"\s+as="fetch"', html)
    if not match:
        print("Could not find preload link in gmaps_response.html.")
        return None
        
    href = match.group(1).replace('&amp;', '&')
    parsed_url = urllib.parse.urlparse(href)
    query_params = urllib.parse.parse_qs(parsed_url.query)
    return query_params.get('pb', [''])[0]

def fetch_cafes_for_query(pb_base, query, offset):
    # Google Maps tbm=map endpoint
    url = "https://www.google.com/search"
    
    # Original query string in our template html
    original_query = "cafes in District 7, Ho Chi Minh City"
    
    # Replace query in pb and format pagination
    pb_val = pb_base.replace(original_query, query)
    
    # Insert offset
    if "!7i20" in pb_val:
        pb_val = pb_val.replace("!7i20", f"!7i20!8i{offset}")
        
    params = {
        'tbm': 'map',
        'authuser': '0',
        'hl': 'vi',
        'gl': 'tw',
        'q': query,
        'pb': pb_val
    }
    
    query_string = urllib.parse.urlencode(params, doseq=True)
    fetch_url = f"{url}?{query_string}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'Referer': f"https://www.google.com/maps/search/{urllib.parse.quote(query)}/",
    }
    
    req = urllib.request.Request(fetch_url, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            
            if content.startswith(")]}'"):
                content = content[4:].strip()
            else:
                content = content.strip()
                
            data = json.loads(content)
            
            cafes = []
            if len(data) > 64 and data[64] is not None:
                for item in data[64]:
                    if len(item) > 1 and item[1] is not None:
                        details = item[1]
                        # Extract fields
                        name = details[11] if len(details) > 11 else None
                        if not name:
                            continue
                            
                        # Coordinates
                        lat = details[9][2] if len(details) > 9 and details[9] and len(details[9]) > 2 else None
                        lon = details[9][3] if len(details) > 9 and details[9] and len(details[9]) > 3 else None
                        
                        # Address
                        addr = details[18] if len(details) > 18 and details[18] else (
                            details[39] if len(details) > 39 and details[39] else ''
                        )
                        
                        # Rating
                        rating = None
                        if len(details) > 4 and details[4] and len(details[4]) > 7:
                            rating = details[4][7]
                            
                        # Place ID
                        place_id = details[78] if len(details) > 78 else None
                        maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}" if place_id else ""
                        
                        cafes.append({
                            'name': name,
                            'latitude': lat,
                            'longitude': lon,
                            'address': addr,
                            'rating': rating,
                            'place_id': place_id,
                            'url': maps_url
                        })
            return cafes
    except Exception as e:
        print(f"Error fetching '{query}' offset {offset}: {e}")
        return []

def is_in_district_7(cafe):
    lat = cafe.get('latitude')
    lon = cafe.get('longitude')
    addr = cafe.get('address', '').lower()
    
    if lat is None or lon is None:
        return False
        
    # Check bounding box coordinates
    # Lat: 10.69779 to 10.77740
    # Lon: 106.69019 to 106.76679
    in_bbox = (10.69779 <= lat <= 10.77740) and (106.69019 <= lon <= 106.76679)
    if not in_bbox:
        return False
        
    # Check if address contains District 7 keywords
    # This is to exclude cafes in District 1, 4, 8, Nha Be, Thu Duc that fall in the bbox edges
    d7_keywords = ["quận 7", "district 7", "q7", "q.7", "phú mỹ hưng", "phu my hung"]
    in_address = any(kw in addr for kw in d7_keywords)
    
    # Also check if address contains ward names of District 7
    d7_wards = ["tân thuận đông", "tân thuận tây", "tân kiểng", "tân hưng", "bình thuận", 
                "tân phong", "tân phú", "tân quy", "phú thuận", "phú mỹ"]
    in_wards = any(ward in addr for ward in d7_wards)
    
    return in_address or in_wards

def main():
    pb_base = get_base_pb()
    if not pb_base:
        print("Failed to get base pb. Exiting.")
        return
        
    # List of wards in District 7
    wards = [
        "Tân Hưng", "Tân Phong", "Tân Quy", "Tân Kiểng", 
        "Tân Thuận Đông", "Tân Thuận Tây", "Bình Thuận",
        "Tân Phú", "Phú Mỹ", "Phú Thuận"
    ]
    
    all_cafes = {}
    
    # We will search for each ward
    for ward in wards:
        query = f"cafes in {ward}, Quận 7, Hồ Chí Minh"
        print(f"\n--- Crawling Ward: {ward} ---")
        
        # Fetch pages: offset 0 (page 1) and offset 20 (page 2)
        # That gives 40 results per ward
        for offset in [0, 20]:
            print(f"Fetching offset {offset}...")
            cafes = fetch_cafes_for_query(pb_base, query, offset)
            print(f"Found {len(cafes)} results.")
            
            for cafe in cafes:
                # Use place_id as unique key, or (name + lat + lon) if place_id is not available
                key = cafe['place_id'] if cafe['place_id'] else f"{cafe['name']}_{cafe['latitude']}_{cafe['longitude']}"
                
                # Check if it is in District 7
                if is_in_district_7(cafe):
                    # Check if already added
                    if key not in all_cafes:
                        cafe['ward'] = ward
                        all_cafes[key] = cafe
                else:
                    # Debug print for filtered out cafes
                    # print(f"  Filtered out (not D7): {cafe['name']} ({cafe['latitude']}, {cafe['longitude']}) - {cafe['address']}")
                    pass
            
            # Politeness delay
            time.sleep(random.uniform(1.0, 2.5))
            
    # Export to CSV
    csv_file = "cafes_district_7_gmaps.csv"
    headers = ["Name", "Latitude", "Longitude", "Address", "Ward", "Rating", "Google Maps URL"]
    
    with open(csv_file, mode='w', encoding='utf-8-sig', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        
        for key, cafe in all_cafes.items():
            writer.writerow([
                cafe['name'],
                cafe['latitude'],
                cafe['longitude'],
                cafe['address'],
                cafe.get('ward', ''),
                cafe['rating'] if cafe['rating'] is not None else '',
                cafe['url']
            ])
            
    print(f"\n==================================================")
    print(f"Crawl Completed successfully!")
    print(f"Total unique District 7 cafes saved: {len(all_cafes)}")
    print(f"CSV file exported to: {csv_file}")
    print(f"==================================================")

if __name__ == "__main__":
    main()
