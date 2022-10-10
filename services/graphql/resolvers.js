const resolvers = {
      RootQuery: {
        posts(root, args, context) {
          return []; 
        }, 
      }, 
    }; 
   module.exports = {
    resolvers
   }