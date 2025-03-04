export function getProjectTemplates(language: string) {
    const isTs = language === 'TypeScript';
    return {
      router: isTs
        ? `import { Router } from '@axonlabs/core';
  const router = Router();
  router.get('/sample', (req, res) => {
    res.status(200).body({ message: 'Sample API response' });
  });
  export default router;`
        : `const { Router } = require('@axonlabs/core');
  const router = Router();
  router.get('/sample', (req, res) => {
    res.status(200).body({ message: 'Sample API response' });
  });
  module.exports = router;`,
      controller: isTs
        ? `export const sampleController = (req, res) => {
    res.status(200).body({ message: 'Hello from Sample Controller' });
  };`
        : `exports.sampleController = (req, res) => {
    res.status(200).body({ message: 'Hello from Sample Controller' });
  };`,
      middleware: isTs
        ? `export const sampleMiddleware = async (req, res, next) => {
    // Sample middleware logic
    next();
  };`
        : `exports.sampleMiddleware = async (req, res, next) => {
    // Sample middleware logic
    next();
  };`,
      model: isTs
        ? `export const sampleModel = {
    data: 'This is sample data'
  };`
        : `exports.sampleModel = {
    data: 'This is sample data'
  };`
    };
  }
  