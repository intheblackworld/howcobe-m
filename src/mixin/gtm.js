export default {
  mounted() {
    const scriptArray = []
    this.$gtmCode.forEach((gtm) => {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-${gtm}');`
      const n = document.createElement('noscript')
      n.type = 'text/javascript'
      n.async = true
      n.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-${gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      const obj = {
        s,
        n
      }
      scriptArray.push(obj)
    })

    scriptArray.forEach(script => {
      document.head.appendChild(script.s)
      this.$refs.gtmNoScript.appendChild(script.n)
    })
  }
}
