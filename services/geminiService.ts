
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getRideRecommendations = async (location: string, difficulty: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${location} yakınlarında, zorluk derecesi ${difficulty} olan 3 adet manzaralı motosiklet rotası öner. Mesafe, tahmini süre ve yol kalitesi gibi detayları ekle. Premium bir motosiklet kulübü için yardımsever ve maceracı bir dil kullan.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Rota hatası:", error);
    return "Şu an AI önerileri yüklenemiyor. Lütfen daha sonra tekrar deneyin.";
  }
};

export const searchNearbyShops = async (lat: number, lng: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `${lat}, ${lng} koordinatları yakınındaki en iyi puanlanmış motosiklet tamirhanelerini ve motorcuların sevdiği kafeleri bul.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Harita arama hatası:", error);
    return "Yakınlardaki mekanlar getirilemedi.";
  }
};

// Harita için yapılandırılmış JSON verisi döndüren yeni fonksiyon
export const getPlacesForMap = async (lat: number, lng: number): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Şu koordinatlar çevresindeki (${lat}, ${lng}) popüler motosiklet buluşma noktaları, tamirciler ve manzaralı durakları bul.
      
      Lütfen yanıtı SADECE aşağıdaki JSON formatında ver:
      [
        {
          "type": "shop" | "cafe" | "scenic" | "event",
          "title": "Mekan Adı",
          "description": "Kısa açıklama",
          "lat": enlem_degeri,
          "lng": boylam_degeri
        }
      ]
      En az 5 mekan öner. Gerçek koordinatlara yakın tahminler yap.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["shop", "cafe", "scenic", "event"] },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Harita veri hatası:", error);
    return [];
  }
};
