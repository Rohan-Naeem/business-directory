// Floating WhatsApp button, like the BizPrimeHub example: a green
// circle at the bottom-left (Ask Bizz already uses bottom-right).
// Clicking it opens WhatsApp to the site owner's number with a
// prefilled question, exactly the api.whatsapp.com/send screen the
// user sent. The WhatsApp profile name shown on that screen comes
// from the WhatsApp account itself, not from this link.
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923328323334?text=Hi%20Global%20Bizz%20Hub!%20I%20have%20a%20question."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Premium Marketing on WhatsApp"
      title="Chat with Premium Marketing on WhatsApp"
      className="fixed bottom-5 left-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-transform hover:scale-105"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://cdn.simpleicons.org/whatsapp/white"
        alt="WhatsApp"
        width={32}
        height={32}
        loading="lazy"
        className="h-8 w-8"
      />
    </a>
  );
}
