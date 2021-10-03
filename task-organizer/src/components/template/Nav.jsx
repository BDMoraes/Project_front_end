import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>
            <Link to="/daily">
                <i className="fa fa-book"></i> Diários
            </Link>
            <Link to="/relatorio">
            <i className="fa fa-check"></i> Relatórios
            </Link>
        </nav>
    </aside>