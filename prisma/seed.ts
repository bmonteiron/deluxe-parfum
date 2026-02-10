import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@deluxeparfum.com' },
    update: {},
    create: {
      email: 'admin@deluxeparfum.com',
      name: 'Administrador',
      password: adminPassword,
      isAdmin: true,
      phone: '(11) 99999-9999',
    },
  })

  console.log('✅ Admin criado:', admin.email)

  // Criar produtos de exemplo
  const produtos = [
    {
      name: 'Noir Élégance',
      description: 'Uma fragrância sofisticada e misteriosa, perfeita para ocasiões especiais. Combina notas amadeiradas com toques florais delicados.',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      size: '100ml',
      concentration: 'EDP',
      price: 299.90,
      stock: 15,
      notes: 'Notas de topo: Bergamota, Limão Siciliano. Notas de coração: Jasmim, Rosa. Notas de fundo: Âmbar, Madeira de Cedro',
      intensity: 'Intensa',
      durability: '8-10 horas',
    },
    {
      name: 'Ambre Royale',
      description: 'Luxuoso e envolvente, este parfum transmite elegância e poder. Ideal para quem busca deixar uma marca inesquecível.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800',
      size: '100ml',
      concentration: 'Parfum',
      price: 349.90,
      stock: 10,
      notes: 'Notas de topo: Cardamomo, Gengibre. Notas de coração: Âmbar, Patchouli. Notas de fundo: Vanilla, Almíscar',
      intensity: 'Muito Intensa',
      durability: '10-12 horas',
    },
    {
      name: 'Velvet Rose',
      description: 'Romântico e sensual, celebra a rosa em sua forma mais pura. Uma homenagem à feminilidade clássica.',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',
      size: '100ml',
      concentration: 'EDP',
      price: 279.90,
      stock: 20,
      notes: 'Notas de topo: Pêra, Tangerina. Notas de coração: Rosa Damascena, Peônia. Notas de fundo: Musk, Sândalo',
      intensity: 'Moderada',
      durability: '6-8 horas',
    },
    {
      name: 'Oud Mystique',
      description: 'Oriental e rico, apresenta o precioso Oud em toda sua glória. Uma experiência olfativa única e exótica.',
      image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
      size: '50ml',
      concentration: 'Parfum',
      price: 399.90,
      stock: 8,
      notes: 'Notas de topo: Açafrão, Canela. Notas de coração: Oud, Rosa Búlgara. Notas de fundo: Âmbar Cinza, Couro',
      intensity: 'Muito Intensa',
      durability: '12+ horas',
    },
    {
      name: 'Citrus Fresh',
      description: 'Vibrante e energizante, perfeito para o dia a dia. Traz frescor e vitalidade a cada borrifada.',
      image: 'https://images.unsplash.com/photo-1585120040359-4df1cd89c559?w=800',
      size: '100ml',
      concentration: 'EDT',
      price: 249.90,
      stock: 25,
      notes: 'Notas de topo: Limão, Laranja, Toranja. Notas de coração: Verbena, Folhas de Chá Verde. Notas de fundo: Almíscar Branco',
      intensity: 'Leve',
      durability: '4-6 horas',
    },
    {
      name: 'Leather & Wood',
      description: 'Masculino e marcante, une couro e madeiras nobres em uma composição atemporal.',
      image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800',
      size: '100ml',
      concentration: 'EDP',
      price: 329.90,
      stock: 12,
      notes: 'Notas de topo: Pimenta Rosa, Cardamomo. Notas de coração: Couro, Vetiver. Notas de fundo: Cedro, Patchouli',
      intensity: 'Intensa',
      durability: '8-10 horas',
    },
    {
      name: 'Ocean Breeze',
      description: 'Aquático e refrescante, evoca a brisa do mar e a liberdade do oceano.',
      image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800',
      size: '100ml',
      concentration: 'EDT',
      price: 269.90,
      stock: 18,
      notes: 'Notas de topo: Nota Marinha, Menta. Notas de coração: Lavanda, Gerânio. Notas de fundo: Âmbar, Cedro',
      intensity: 'Moderada',
      durability: '5-7 horas',
    },
  ]

  for (const produto of produtos) {
    await prisma.product.create({
      data: produto,
    })
  }

  console.log(`✅ ${produtos.length} produtos criados`)

  // Criar materiais de estoque de produção
  await prisma.essence.createMany({
    data: [
      { name: 'Rosa Damascena', quantityMl: 500, cost: 2.5 },
      { name: 'Jasmim', quantityMl: 300, cost: 3.0 },
      { name: 'Âmbar', quantityMl: 400, cost: 1.8 },
      { name: 'Oud', quantityMl: 150, cost: 5.0 },
      { name: 'Bergamota', quantityMl: 600, cost: 1.2 },
    ],
  })

  await prisma.alcohol.create({
    data: {
      name: 'Álcool de Cereais 96°',
      quantityLiters: 10,
      cost: 15.0,
    },
  })

  await prisma.bottle.createMany({
    data: [
      { model: 'Frasco Premium 100ml', size: '100ml', quantity: 50, cost: 8.0 },
      { model: 'Frasco Premium 50ml', size: '50ml', quantity: 30, cost: 6.0 },
    ],
  })

  await prisma.baseFragrance.createMany({
    data: [
      { name: 'Base Amadeirada', quantity: 20, cost: 25.0 },
      { name: 'Base Floral', quantity: 15, cost: 22.0 },
    ],
  })

  console.log('✅ Estoque de produção criado')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
