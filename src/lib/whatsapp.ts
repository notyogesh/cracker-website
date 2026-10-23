export const BUY_MESSAGE = 'Hi! I want to buy crackers. Please share the latest price list and offers.'

// Click-to-chat link that opens WhatsApp with `text` already typed.
export const whatsappLink = (number: string, text: string = BUY_MESSAGE) =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
