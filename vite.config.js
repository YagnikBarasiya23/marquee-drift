import { defineConfig } from 'vite';
export default defineConfig({build:{rollupOptions:{output:{exports:'named'}},lib:{entry:'src/index.js',name:'MarqueeDrift',formats:['es','umd'],fileName:format=>format==='es'?'marquee-drift.js':'marquee-drift.umd.cjs'}}});
