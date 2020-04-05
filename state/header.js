export default {
  acceptors: [
    model => proposal => {
      const { hash } = proposal;

      if (hash && model.header.currentHash != hash) {
        model.header.currentHash = hash;
      }

      return model;
    }
  ]
}
