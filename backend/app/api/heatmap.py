from fastapi import APIRouter


router = APIRouter()


@router.get("/api/heatmap")
def get_heatmap():
    return {
        "success": True,
        "data": [
            # South India
            {
                "state": "Andhra Pradesh",
                "scams": 120,
            },
            {
                "state": "Telangana",
                "scams": 95,
            },
            {
                "state": "Tamil Nadu",
                "scams": 80,
            },
            {
                "state": "Karnataka",
                "scams": 75,
            },
            {
                "state": "Kerala",
                "scams": 65,
            },

            # North India
            {
                "state": "Delhi",
                "scams": 110,
            },
            {
                "state": "Uttar Pradesh",
                "scams": 105,
            },
            {
                "state": "Haryana",
                "scams": 85,
            },
            {
                "state": "Punjab",
                "scams": 70,
            },
            {
                "state": "Rajasthan",
                "scams": 90,
            },
            {
                "state": "Uttarakhand",
                "scams": 55,
            },
            {
                "state": "Himachal Pradesh",
                "scams": 45,
            },
            {
                "state": "Jammu and Kashmir",
                "scams": 40,
            },

            # West India
            {
                "state": "Maharashtra",
                "scams": 115,
            },
            {
                "state": "Gujarat",
                "scams": 88,
            },
            {
                "state": "Goa",
                "scams": 35,
            },

            # Central India
            {
                "state": "Madhya Pradesh",
                "scams": 78,
            },
            {
                "state": "Chhattisgarh",
                "scams": 52,
            },

            # East India
            {
                "state": "West Bengal",
                "scams": 82,
            },
            {
                "state": "Bihar",
                "scams": 76,
            },
            {
                "state": "Odisha",
                "scams": 60,
            },
            {
                "state": "Jharkhand",
                "scams": 58,
            },

            # North-East India
            {
                "state": "Assam",
                "scams": 48,
            },
            {
                "state": "Tripura",
                "scams": 30,
            },
            {
                "state": "Meghalaya",
                "scams": 28,
            },
            {
                "state": "Manipur",
                "scams": 25,
            },
            {
                "state": "Mizoram",
                "scams": 20,
            },
            {
                "state": "Nagaland",
                "scams": 18,
            },
            {
                "state": "Arunachal Pradesh",
                "scams": 15,
            },
            {
                "state": "Sikkim",
                "scams": 12,
            },
        ],
    }