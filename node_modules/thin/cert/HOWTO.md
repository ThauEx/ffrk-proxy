# HOWTO

    openssl genrsa -des3 -out dummy.key 1024

    openssl req -new -key dummy.key -out dummy.csr

    cp dummy.key dummy.key.org
    openssl rsa -in dummy.key.org -out dummy.key

    openssl x509 -req -days 365 -in dummy.csr -signkey dummy.key -out dummy.crt
