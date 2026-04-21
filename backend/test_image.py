import requests

# Your working key
SPOON_KEY = "6a21f30135b248e19b5282ef2d88b3e9"

def final_attempt():
    url = f"https://api.spoonacular.com/recipes/complexSearch?query=apple&apiKey={SPOON_KEY}&number=1"
    r = requests.get(url)
    data = r.json()
    
    # This matches the "results": [ ] in your screenshot
    all_results = data['results'] 
    
    if len(all_results) > 0:
        # This grabs the FIRST { } block inside that list
        first_recipe = all_results 
        
        # Now we can grab the "image" link
        img_link = first_recipe['image']
        
        print("✅ SUCCESS!")
        print(f"🔗 IMAGE URL: {img_link}")
    else:
        print("❌ No results found.")

final_attempt()