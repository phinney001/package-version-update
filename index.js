const fs = require('fs')
const path = require('path')
const request = require('request')
const { green } = require('ansi-colors')

class Version {
  constructor() {
    this.packagePath = path.join(process.cwd(), './package.json')
    this.package = require(this.packagePath)
  }

  /**
   * 获取版本号
   */
  getVersion() {
    request(`https://registry.npmjs.org/${this.package.name}`, (error, response, body) => {
      if (error) throw (error)
      const res = JSON.parse(body)
      const version = res && res['dist-tags'] && res['dist-tags'].latest
      console.log(green(`[${this.package.name}] 当前版本号：${version || '无'}`))
    })
  }

  /**
   * 更新版本号
   */
  update() {
    request(`https://registry.npmjs.org/${this.package.name}`, (error, response, body) => {
      if (error) throw (error)
      const res = JSON.parse(body)
      let version = res && res['dist-tags'] && res['dist-tags'].latest
      if (version) {
        version = version.split('.').map((num, numIndex) => {
          return numIndex === 2 ? (Number(num) + 1) : num
        }).join('.')
        if (version !== this.package.version) {
          console.log(green('正在更新版本号...'))
          let packageString = fs.readFileSync(this.packagePath, 'utf-8')
          const mathString = packageString.match(/(?="version": ").*?(?=,)/)
          packageString = packageString.replace(mathString, `"version": "${version}"`)
          fs.writeFileSync(this.packagePath, packageString, 'utf-8')
          console.log(green('更新版本号成功！'))
        } else {
          console.log(green('版本号无需更新！'))
        }
      }
    })
  }

  /**
   * 运行
   */
  start() {
    const opType = Array.from(process.argv)[2]
    if (opType === 'update') {
      this.update()
    } else {
      this.getVersion()
    }
  }
}

const version = new Version()
version.start()
