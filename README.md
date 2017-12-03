### Developement
#### In-browser and/or Ioic Dev App
If you intend to use a local browser only workflow, run 
```
ionic serve
```

To faciliate capturing logs from device browsers/ Dev App, throw in the `-c` and optionally `--no-open` flags, like so
```
ionic serve -c --no-open
```

Live-reloading is backed into the `ionic serve` instrumentation

#### On device
```
ionic cordova run ios -lc --device
```

*Potential gotcha*: your device needs to be awake/unlocked by the time the command attempts to launch the app, or the process will fail

You can still access the app via the browsers by hitting the target IP and port as if it were started with `ionic serve`

### Testing

See https://leifwells.github.io/2017/08/27/testing-in-ionic-configure-existing-projects-for-testing/ for details on the 

#### Unit tests
One-off: `npm test`
Continious: `npm run test:watch`

#### End-to-end tests
Run `npm run test:e2e`
