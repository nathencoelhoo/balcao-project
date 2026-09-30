export type Consent = "public" | "family" | "researcher";

export type Village = {
  id: string;
  name: string;
  age: number;
  village: string;
  topic: string;
  x: number;
  y: number;
  dialect: string;
  consent: Consent;
  english: string;
  romi: string;
  devanagari: string;
};

export const CONSENT_LABEL: Record<Consent, { label: string; note: string; color: string }> = {
  public: { label: "Public", note: "Anyone may listen and share this recording.", color: "#E5A93C" },
  family: { label: "Family only", note: "Visible only to registered kin of the speaker.", color: "#A33226" },
  researcher: { label: "Researcher access", note: "Available only under a signed archive agreement.", color: "#8a8378" },
};

export const VILLAGES: Village[] = [
  {
    id: "siolim-mariano",
    name: "Mariano Bab",
    age: 71,
    village: "Siolim (Bardez)",
    topic: "The Last Coconut Tapper",
    x: 120,
    y: 110,
    dialect: "Bardez Konkani",
    consent: "public",
    english:
      "Every morning at 5 AM, before the birds wake up, I climb the coconut palms. My father taught me how to tap the toddy (sur). Today, the youth don't want to climb trees; they look at screens. But the tree remembers my hands.",
    romi:
      "Sokallim panch vorancher, suknnim utstche poili, hanv maddancher choddttam. Mhojea bapanmaka sur kaddunk xikoilem. Aiz-kalche bhurgem maddancher choddunk sodoronant; tim fone-ar polletat. Punn madd mhoje hat mofnnan dovorta.",
    devanagari:
      "सकाळीं पांच वरांचेर, सुकणीं उट्चे पयलीं, हांव माडांचेर चडट्टाम. म्हज्या बापान मका सूर काडूंक शिकयलें. आयज-कालचे भुरगे माडांचेर चडूंक सोदरोनात; तीं फोन-आर पळयतात. पूण माड म्हजे हात मफणान दवरता.",
  },
  {
    id: "saligao-agnelo",
    name: "Agnelo Bab",
    age: 74,
    village: "Saligao (Bardez)",
    topic: "The Feast-Day Mando",
    x: 95,
    y: 175,
    dialect: "Bardez Konkani",
    consent: "family",
    english:
      "On the feast day of Mãe de Deus, our village became one song. My grandmother taught me the mando before I could read — the slow, sorrowful mando of longing, and the fast dulpod after, so joy always follows grief. Now the young ones record with their phones, but they still ask me for the old words.",
    romi:
      "Mae de Deus fest disa, amcho gaanv ek gaanem zata. Mhojem aji mhaka mando xikoi mhaka vachunk kolonaslolo poilim — dhoinim, dukhi mando otheavponacho, ani tea uprant vegim dulpod, hea khatir sontos sodanch dukha uprant ieta. Atam torni fonanchea sogott rekord kortat, punn ti ainch mhojea kodden zoinim utram magtat.",
    devanagari:
      "मे दे देउस फेस्त दिसा, आमचो गांव एक गाणें जाता. म्हजें आजी म्हाका मान्दो शिकयी म्हाका वाचुंक कळनासलों पयलीं — धयीं, दुखी मान्दो ओथेवपणाचो, आनी त्या उपरांत वेगीं दुल्पद, ह्या खातीर सन्तोस सदांच दुखा उपरांत येता. आतां तरणी फोनांच्या सोगोट रेकॉर्ड करतात, पूण ती आयनच म्हज्या कडेन जोइनीं उतरां मागतात.",
  },
  {
    id: "candolim-tukaram",
    name: "Tukaram Bab",
    age: 78,
    village: "Candolim",
    topic: "The Song of the Ramponn Net",
    x: 145,
    y: 230,
    dialect: "Bardez Konkani",
    consent: "public",
    english:
      "When we pull the big Ramponn net from the sea, we all sing together. Fifty men pulling as one body. The sea gives to everyone if you respect her. Now the big tourist boats make noise, but the old sea still sings our songs at night.",
    romi:
      "Zeddnam ami dorieantlim vhoddlem Ramponn ostdam, ami sogllim sangata gaitam. Ponas monxam eka sangata voddttat. Dorieo sogllanck dita zori tum taka man ditat. Atam vhoddlim tourist bottim avaz kortat, punn dorieo raticho amchim kantaram mhonnta.",
    devanagari:
      "जेन्नां आमी दरियांतलीं व्हडलें रामपण ओसताम, आमी सगळीं सांगाता गायताम. पन्नास मनशाम एका सांगाता वड्टात. दरियो सगळ्यांक दिता जरी तुम ताका मान दितात. आतां व्हडलीं टुरिस्ट बोटीं आवाज करतात, पूण दरियो रातीचो आमचीं कांतारां म्हण्टा.",
  },
  {
    id: "majorda-maria",
    name: "Maria Bai",
    age: 66,
    village: "Majorda (Salcete)",
    topic: "The Fire of the Poder",
    x: 100,
    y: 445,
    dialect: "Salcete Konkani",
    consent: "researcher",
    english:
      "The smell of fresh, hot Poee bread in the morning is the true smell of Goa. Our mud oven (forn) has been burning since my grandfather's time. Electric ovens don't give the same taste; you need local wood fire and soul.",
    romi:
      "Sokallim taje, gorr-gorr Poeecho dhom-dhom mhollear Goancho khoro pormoll. Amcho matiecho forn mhojea xapai chea kalla pasun petta. Electric fornancher to suvad ienam; taka thollavi khanchanchi uzo ani kalliz zai.",
    devanagari:
      "सकाळीं ताजे, गर-गर पोयेचो दम-दम म्हणल्यार गोयांचो खरो परमळ. आमचो मातीचो फॉर्न म्हज्या शापाय च्या काळा पासून पेट्टा. इलेक्ट्रीक फॉर्नांचेर तो सुवाद येनाम; ताका थळावी खांचांची उजो आनी काळीज जाय.",
  },
];

/** A word carries a "breath" after it if it ends in punctuation. */
export function breathAfter(word: string): "long" | "short" | null {
  if (/[.…]$/.test(word)) return "long";
  if (/[,;—-]$/.test(word)) return "short";
  return null;
}
