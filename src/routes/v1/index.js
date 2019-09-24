
'use strict';


/********************************
 ********* All routes ***********
 ********************************/
let v1Routes = [
  ...require('./authRoutes'),
  ...require('./userRoutes'),
]
module.exports = v1Routes;
