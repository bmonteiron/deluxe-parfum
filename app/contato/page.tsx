import Link from 'next/link'
import Header from '@/components/Header'

export default function ContatoPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif text-center mb-12">Entre em Contato</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif mb-6">Fale Conosco</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">contato@deluxeparfum.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-gray-600">(11) 99999-9999</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold">Localização</p>
                  <p className="text-gray-600">São Paulo, SP</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="font-semibold">Horário de Atendimento</p>
                  <p className="text-gray-600">Seg - Sex: 9h às 18h</p>
                  <p className="text-gray-600">Sáb: 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-serif mb-6">Envie uma Mensagem</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input type="text" className="input-field" placeholder="Seu nome" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="input-field" placeholder="seu@email.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input type="tel" className="input-field" placeholder="(11) 99999-9999" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea 
                  className="input-field" 
                  rows={5} 
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2026 Deluxe Parfum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
