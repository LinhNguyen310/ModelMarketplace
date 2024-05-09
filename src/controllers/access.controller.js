'use strict'

const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {

    signUp = async (req, res, next) => {
        new CREATED (
            {
                message: 'User has been created',
                metadata: await AccessService.signUp(req.body)
            }
        ).send(res);
    }

    login = async (req, res, next) => {
        new SuccessResponse (
            {
                metadata: await AccessService.login(req.body)
            }
        ).send(res);
    }
}

module.exports = new AccessController();