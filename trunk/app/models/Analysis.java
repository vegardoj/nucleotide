package models;

import javax.persistence.Entity;
import play.db.jpa.Model;

/*
 * Analysis.java
 *
 * Created: 02.feb.2010 21:50:20
 */

/**
 *
 * @author Martin
 */
@Entity
public class Analysis extends Model {

    // needs rewrite after we figure out which data to include

    public String name;
    public double volume;
    public double mole;
    public double conc;
    public double ph;

    public Analysis(String name, double volume, double mole, double conc, double ph) {
        this.name = name;
        this.volume = volume;
        this.mole = mole;
        this.conc = conc;
        this.ph = ph;
    }



}
