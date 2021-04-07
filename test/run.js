import glob from 'glob'
import path from 'path'

glob("./src/**/*.test.js", (err, files) => {
  for ( const f of files ) {
    import(path.resolve(process.cwd(), f))
  }
})
