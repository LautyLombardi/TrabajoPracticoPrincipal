from db.db import db
import os, json
from flask import Flask, request, jsonify
from models.Role import Role

def saveRol(data):
    try:
        role = Role(name=data.get('name'),description=data.get('description'),createDate=data.get('createDate'))
        db.session.add(role)
        db.session.commit()

        return True
    except Exception as e:
        return e

def updateRol(id,data):
    role=Role.query.get(id)

    if not role:
        return 404
    
    try:
        role.name=data.get('name')
        role.description=data.get('description')
        role.createDate=data.get('createDate')

    except Exception as e:
        return e

def getRol(id,data):
    role=Role.query.get(id)

    if not role:
        return 404

    try:
        jsonify(role)
        return (200,)
    
    except Exception as e:
        return e