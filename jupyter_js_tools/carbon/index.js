const data = JSON.parse('%s')
const Chart = '%s'

require(['carbon'], (carbon) => {
  const options = {
    height: '400px',
    width: '400px',
  }

  new carbon[Chart](document.getElementById('carbon-container'), {
    data,
    options,
  })
})
