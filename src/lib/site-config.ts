// Edit these values to update brand-wide info across the site.
export const site = {
  name: "V11 Gym",
  tagline: "Transform Your Body. Unlock Your Potential.",
  city: "Roorkee",
  region: "Uttarakhand",
  country: "India",
  address: "Roorkee, Uttarakhand, India",
  // TODO: replace placeholders with your real numbers/email
  phone: "+91 98765 43210",
  phoneRaw: "+919876543210",
  whatsapp: "+919876543210",
  email: "info@v11gym.in",
  hours: "Mon – Sat: 5:00 AM – 10:00 PM · Sun: 6:00 AM – 12:00 PM",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  // Update once a project URL is set
  mapsQuery: "V11+Gym+Roorkee+Uttarakhand",
};

export const whatsappLink = (msg = "Hi V11 Gym, I'd like to know more about your memberships.") =>
  `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;

export const telLink = `tel:${site.phoneRaw}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${site.mapsQuery}`;
