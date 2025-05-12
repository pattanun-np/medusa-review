# Medusa Plugin review

## How to install
1. add the plugin to your medusa backend
```bash
  yarn add medusa-review
```
2. configure your medusa backend `medusa-config.ts`
```ts
module.exports = defineConfig({
  // ... rest of the config
  plugins: [
    // ... rest of the plugins
    {
      resolve: "medusa-review",
      options: {},
    },
  ],
});
```

3. run the migrations in your medusa core backend
```bash
yarn medusa db:migrate
```

4. all done now just start your medusa backend
`yarn dev` `yarn start` or whatever you use to start your backend