# version.coffee
# Copyright 2017 9165584 Canada Corporation <legal@fuzzy.ai>
# All rights reserved.

fs = require 'fs'
path = require 'path'
pkg = fs.readFileSync path.join(__dirname, '..', 'package.json')
data = JSON.parse pkg

module.exports = data.version
