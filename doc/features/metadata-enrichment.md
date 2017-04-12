# Metadata enrichment #

**Middlewares** can be used to enrich access events by querying external APIs.
Note that it may slow the process down, as the number of queries is limited over time.

However, the results are temporarily cached in the mongoDB database, to prevent multiple occurrences of a document from generating further requests. The actual number of requests (i.e. excluding cached ones) is available in the report under `general -> <middleware>-queries`. Where `<middleware>` is the name of the middleware involved.

For more details on middlewares, you can read the [dedicated section](../development/middlewares.html).

By default, ezPAARSE is configured for using 4 enrichment middlewares: 
  * istex
  * crossref
  * sudoc
  * hal


## Configuring Crossref Middleware Call ##

The Crossref middleware uses the `DOI` found in access events to request metadata using the [node-crossref](https://www.npmjs.com/package/meta-doi) module.

### Headers ###
  * **crossref-Enrich**: set to `false` to disable crossref enrichment. Enabled by default.
  * **crossref-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`
  * **crossref-throttle**: minimum time to wait between queries, in milliseconds. Defaults to `200`ms
  * **crossref-paquet-size**: maximum number of identifiers to send for query in a single request. Defaults to `50` 
  * **crossref-buffer-size**: maximum number of memorised access events before sending a request. Defaults to `1000`

## Configuring Sudoc Middleware Call ##

### Headers ###
  * **sudoc-Enrich**: set to `true` to enable Sudoc enrichment. Disabled by default.
  * **sudoc-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **sudoc-Throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`.

## Configuring HAL Middleware Call ##

The HAL middleware uses the `hal-identifier` found in the access events to request metadata using the [node-hal](https://www.npmjs.com/package/methal)

### Headers ###
  * **HAL-Enrich**: set to `true` to enable HAL enrichment. Disabled by default.
  * **HAL-TTL**: lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **HAL-Throttle**: minimum time to wait between queries, in milliseconds. Defaults to `500`.

## Configuring ISTEX Middleware Call ##

The ISTEX middleware uses the `istex-identifier` found in the access events to request metadata using the [node-istex](hhttps://www.npmjs.com/package/node-istex)

ISTEX middleware is automatically activated on ISTEX logs

### Headers ###
  * **istex-enrich** : set to `true` to enable ISTEX enrichment. Disabled by default.
  * **istex-ttl** : lifetime of cached documents, in seconds. Defaults to `7 days (3600 * 24 * 7)`.
  * **istex-throttle** : minimum time to wait between queries, in milliseconds. Defaults to `500`. 
