# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.83] - 2023-12-27

- Fixed bug with `QueryBuilder.find` where `FindCursor` would be returned instead of `BSON.Document[]`
- Fixed bug with `QueryBuilder.findOneAndUpdate` where it would not return the updated document.
- Added more debugging in `/test` to properly test more methods between Query Builder and Model instances.

## [0.1.82] - 2023-12-27

- Fixed bug with `QueryBuilder.aggregate` where the AggregationCursor would be returned instead of the `BSON.Document[]`.

## [0.1.81] - 2023-12-26

- Fixed bug with `QueryBuilder.updateOne` and `QueryBuilder.findOneAndUpdate` where it would run `processDocument` and validate fields that would not exist.

## [0.1.8] - 2023-11-18

- Added `FieldTypes.Mixed` as a Schema option (#1)
- Added Jest tests (not conclusive yet) 
- Added `QueryBuilder` class
  - This will be the backbone to queries inside of Models
  - Also provides an alternative method of just doing queries without going through the Model creation process.
- Fixed issue with Array types not working (#2)
- Added Code Coverage reporting and added jests to CI/CD

## [0.1.6/0.1.7] - 2023-11-17

- Renamed project to Mongo-ODM
- Updated Docs

## [0.1.5] - 2023-11-16

- Added ESLint
- Added Prettier
- Added Better Typed definitions to Model
- Added enhanced documentation (WIP)

## [0.1.4] - 2023-11-15

### Fixed

- Issue with method not calling as an async function
- Removed the force-lowercase of collections