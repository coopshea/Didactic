import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getLessons(req, res)
      case 'POST':
        return await createLesson(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// GET /api/lessons
async function getLessons(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, content')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Transform data in the backend
  const transformedData = data.map(lesson => ({
    ...lesson,
    content: lesson.content?.substring(0, 100) + '...'
  }))

  return res.status(200).json(transformedData)
}

// POST /api/lessons
async function createLesson(req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' })
  }

  const { data, error } = await supabase
    .from('lessons')
    .insert({ title, content })
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: error.message })
  }

  console.log('Created lesson:', data)
  return res.status(201).json(data)
}