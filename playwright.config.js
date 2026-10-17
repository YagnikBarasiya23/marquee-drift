import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'test',testMatch:'**/browser.spec.js',workers:1,use:{baseURL:'http://127.0.0.1:4182'},projects:['chromium','firefox','webkit'].map(browserName=>({name:browserName,use:{browserName}})),webServer:{command:'npm run dev -- --port 4182',url:'http://127.0.0.1:4182',reuseExistingServer:true}});
