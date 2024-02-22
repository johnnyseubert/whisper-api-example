import OpenAI from 'openai';
import fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';

const openai = new OpenAI({
   apiKey: '',
});
const app = fastify();
app.register(fastifyMultipart);

app.post('/', async (request, reply) => {
   const file = await request.file();
   if (!file) return reply.send('No file uploaded');

   // convert file.file to buffer

   const buffer = await file.toBuffer();

   const newFile = new File([buffer], file.filename, {
      type: file.mimetype,
   });

   const transcription = await openai.audio.transcriptions.create({
      file: newFile,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word'],
   });

   return reply.send({text: transcription.text});
});

app.listen({ port: 3333 }, () => console.log('iniciou'));
